/**
 * 专业级 Fetch 封装
 * @author 前端专家
 * @version 1.0.0
 */
class HttpClient {
  /**
   * 创建 HttpClient 实例
   * @param {Object} config - 全局配置
   */
  constructor(config = {}) {
    this.baseConfig = {
      baseURL: '',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      retries: 0,
      retryDelay: 1000,
      retryStatusCodes: [408, 429, 500, 502, 503, 504],
      cache: 'default',
      withCredentials: false,
      ...config
    };

    // 拦截器
    this.interceptors = {
      request: [],
      response: []
    };

    // 缓存
    this.cache = new Map();
    
    // 正在进行的请求
    this.pendingRequests = new Map();
    
    // 请求计数器
    this.requestCount = 0;
    
    // 绑定方法
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.delete = this.delete.bind(this);
    this.patch = this.patch.bind(this);
  }

  /**
   * 添加请求拦截器
   * @param {Function} onFulfilled - 成功回调
   * @param {Function} onRejected - 失败回调
   * @returns {Number} 拦截器ID
   */
  interceptRequest(onFulfilled, onRejected) {
    const id = this.interceptors.request.length;
    this.interceptors.request.push({ onFulfilled, onRejected });
    return id;
  }

  /**
   * 添加响应拦截器
   * @param {Function} onFulfilled - 成功回调
   * @param {Function} onRejected - 失败回调
   * @returns {Number} 拦截器ID
   */
  interceptResponse(onFulfilled, onRejected) {
    const id = this.interceptors.response.length;
    this.interceptors.response.push({ onFulfilled, onRejected });
    return id;
  }

  /**
   * 移除请求拦截器
   * @param {Number} id - 拦截器ID
   */
  removeRequestInterceptor(id) {
    this.interceptors.request[id] = null;
  }

  /**
   * 移除响应拦截器
   * @param {Number} id - 拦截器ID
   */
  removeResponseInterceptor(id) {
    this.interceptors.response[id] = null;
  }

  /**
   * 生成请求唯一标识
   * @param {String} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {String} 请求标识
   */
  getRequestKey(url, options) {
    const method = options.method || 'GET';
    const body = options.body || '';
    return `${method}:${url}:${body}`;
  }

  /**
   * 处理请求配置
   * @param {String} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Object} 处理后的配置
   */
  async processRequestConfig(url, options) {
    let config = {
      ...this.baseConfig,
      ...options,
      headers: {
        ...this.baseConfig.headers,
        ...options.headers
      }
    };

    // 应用请求拦截器
    for (const interceptor of this.interceptors.request) {
      if (interceptor) {
        try {
          config = await interceptor.onFulfilled(config);
        } catch (error) {
          if (interceptor.onRejected) {
            config = await interceptor.onRejected(error);
          } else {
            throw error;
          }
        }
      }
    }

    // 处理baseURL
    const fullUrl = config.baseURL ? `${config.baseURL}${url}` : url;
    
    return { fullUrl, config };
  }

  /**
   * 处理响应
   * @param {Response} response - Fetch响应对象
   * @param {Object} config - 请求配置
   * @returns {Promise} 处理后的响应
   */
  async processResponse(response, config) {
    let processedResponse = response;

    // 应用响应拦截器
    for (const interceptor of this.interceptors.response) {
      if (interceptor) {
        try {
          processedResponse = await interceptor.onFulfilled(processedResponse);
        } catch (error) {
          if (interceptor.onRejected) {
            processedResponse = await interceptor.onRejected(error);
          } else {
            throw error;
          }
        }
      }
    }

    // 如果响应不成功，抛出错误
    if (!processedResponse.ok) {
      const error = new Error(`HTTP Error: ${processedResponse.status}`);
      error.response = processedResponse;
      error.config = config;
      throw error;
    }

    return processedResponse;
  }

  /**
   * 执行请求
   * @param {String} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  async request(url, options = {}) {
    // 处理请求配置
    const { fullUrl, config } = await this.processRequestConfig(url, options);
    
    // 创建AbortController用于超时和取消
    const controller = new AbortController();
    if (config.signal) {
      config.signal.addEventListener('abort', () => controller.abort());
    }
    config.signal = controller.signal;

    // 生成请求标识
    const requestKey = this.getRequestKey(fullUrl, config);
    
    // 检查是否有相同请求正在进行
    if (config.cancelDuplicated && this.pendingRequests.has(requestKey)) {
      this.pendingRequests.get(requestKey).abort();
    }
    
    // 记录当前请求
    this.pendingRequests.set(requestKey, controller);
    
    // 增加请求计数
    this.requestCount++;
    
    // 触发请求开始事件
    if (typeof config.onRequestStart === 'function') {
      config.onRequestStart(this.requestCount);
    }

    // 检查缓存
    if (config.useCache && config.method === 'GET') {
      const cachedResponse = this.cache.get(requestKey);
      if (cachedResponse) {
        // 触发请求结束事件
        this.requestCount--;
        if (typeof config.onRequestEnd === 'function') {
          config.onRequestEnd(this.requestCount);
        }
        
        // 从缓存返回
        return cachedResponse;
      }
    }

    // 设置超时
    let timeoutId;
    if (config.timeout > 0) {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, config.timeout);
    }

    // 执行请求，支持重试
    let retries = 0;
    let lastError = null;

    while (retries <= config.retries) {
      try {
        const response = await fetch(fullUrl, config);
        
        // 清除超时定时器
        if (timeoutId) clearTimeout(timeoutId);
        
        // 从正在进行的请求中移除
        this.pendingRequests.delete(requestKey);
        
        // 减少请求计数
        this.requestCount--;
        
        // 触发请求结束事件
        if (typeof config.onRequestEnd === 'function') {
          config.onRequestEnd(this.requestCount);
        }

        // 处理响应
        const processedResponse = await this.processResponse(response, config);
        
        // 缓存响应
        if (config.useCache && config.method === 'GET') {
          const clonedResponse = processedResponse.clone();
          this.cache.set(requestKey, clonedResponse);
          
          // 设置缓存过期时间
          if (config.cacheTime) {
            setTimeout(() => {
              this.cache.delete(requestKey);
            }, config.cacheTime);
          }
        }
        
        return processedResponse;
        
      } catch (error) {
        lastError = error;
        
        // 清除超时定时器
        if (timeoutId) clearTimeout(timeoutId);
        
        // 如果是取消请求，直接抛出错误
        if (error.name === 'AbortError') {
          this.pendingRequests.delete(requestKey);
          this.requestCount--;
          
          if (typeof config.onRequestEnd === 'function') {
            config.onRequestEnd(this.requestCount);
          }
          
          throw new Error('请求被取消或超时');
        }
        
        // 检查是否需要重试
        const shouldRetry = config.retries > 0 && 
          (retries < config.retries) && 
          (
            !error.response || 
            config.retryStatusCodes.includes(error.response.status)
          );
          
        if (shouldRetry) {
          retries++;
          console.log(`请求失败，${config.retryDelay}ms 后第 ${retries} 次重试`);
          await new Promise(resolve => setTimeout(resolve, config.retryDelay));
          continue;
        }
        
        // 不再重试，抛出错误
        this.pendingRequests.delete(requestKey);
        this.requestCount--;
        
        if (typeof config.onRequestEnd === 'function') {
          config.onRequestEnd(this.requestCount);
        }
        
        throw error;
      }
    }
  }

  /**
   * 取消所有请求
   */
  cancelAll() {
    for (const controller of this.pendingRequests.values()) {
      controller.abort();
    }
    this.pendingRequests.clear();
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * GET请求
   * @param {String} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  /**
   * POST请求
   * @param {String} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT请求
   * @param {String} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE请求
   * @param {String} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH请求
   * @param {String} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求结果
   */
  patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
}





// 使用

// 创建实例
const http = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  retries: 2,
  useCache: true,
  cacheTime: 60000, // 缓存1分钟
  onRequestStart: (count) => {
    if (count === 1) {
      // 显示加载指示器
      showLoading();
    }
  },
  onRequestEnd: (count) => {
    if (count === 0) {
      // 隐藏加载指示器
      hideLoading();
    }
  }
});

// 添加请求拦截器
http.interceptRequest(
  (config) => {
    // 添加认证头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptResponse(
  (response) => {
    // 可以在这里统一处理响应
    return response;
  },
  (error) => {
    // 处理401错误
    if (error.response && error.response.status === 401) {
      // 重定向到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 使用示例
async function fetchUserData() {
  try {
    // GET请求
    const response = await http.get('/users/1');
    const userData = await response.json();
    console.log('用户数据:', userData);
    
    // POST请求
    const createResponse = await http.post('/users', {
      name: 'John Doe',
      email: 'john@example.com'
    });
    const newUser = await createResponse.json();
    console.log('新用户:', newUser);
    
    // 带查询参数的GET请求
    const searchResponse = await http.get('/users', {
      params: { role: 'admin', status: 'active' }
    });
    const adminUsers = await searchResponse.json();
    console.log('管理员用户:', adminUsers);
    
  } catch (error) {
    console.error('API错误:', error);
  }
}

// 取消请求示例
const controller = new AbortController();
http.get('/long-operation', { signal: controller.signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// 5秒后取消请求
setTimeout(() => {
  controller.abort();
}, 5000);