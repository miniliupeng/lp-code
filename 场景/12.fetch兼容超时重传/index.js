/**
 * Fetch客户端类
 * 支持超时、重试和取消请求
 */
class FetchClient {
  /**
   * 创建Fetch客户端实例
   * @param {Object} defaultConfig - 默认配置
   */
  constructor(defaultConfig = {}) {
    this.defaultConfig = {
      baseURL: '',
      timeout: 10000,
      retries: 0,
      retryDelay: 1000,
      headers: {},
      ...defaultConfig
    };
  }

  /**
   * 发送请求
   * @param {String} url - 请求地址
   * @param {Object} options - 请求配置
   * @returns {Promise} - 返回Promise
   */
  async fetch(url, options = {}) {
    // 合并配置
    const config = {
      ...this.defaultConfig,
      ...options,
      headers: {
        ...this.defaultConfig.headers,
        ...options.headers
      }
    };

    // 处理baseURL
    const fullUrl = config.baseURL ? 
      `${config.baseURL}${url}` : url;

    // 创建AbortController
    const controller = new AbortController();
    
    // 处理外部signal
    if (config.signal) {
      config.signal.addEventListener('abort', () => controller.abort());
    }
    
    // 设置最终的signal
    const finalOptions = {
      ...config,
      signal: controller.signal
    };
    
    // 删除非标准fetch选项
    delete finalOptions.baseURL;
    delete finalOptions.timeout;
    delete finalOptions.retries;
    delete finalOptions.retryDelay;
    
    // 执行请求
    let attempts = 0;
    
    while (attempts <= config.retries) {
      // 设置超时
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      try {
        console.log('fullUrl', fullUrl);
        
        const response = await fetch(fullUrl, finalOptions);
        
        // 清除超时
        clearTimeout(timeoutId);
        
        // 检查响应状态
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return response;
        
      } catch (error) {
        // 清除超时
        clearTimeout(timeoutId);
        
        // 处理取消请求
        // if (error.name === 'AbortError') {
        //   throw new Error('请求被取消或超时');
        // }
        
        // 处理重试
        if (attempts < config.retries) {
          console.log('error', error);
          
          attempts++;
          console.log(`请求失败，${config.retryDelay}ms后第${attempts}次重试`);
          await new Promise(resolve => setTimeout(resolve, config.retryDelay));
          continue;
        }
        
        // 重试次数用完
        throw error;
      }
    }
  }

  /**
   * GET请求
   * @param {String} url - 请求地址
   * @param {Object} options - 请求配置
   * @returns {Promise} - 返回Promise
   */
  get(url, options = {}) {
    return this.fetch(url, { ...options, method: 'GET' });
  }

  /**
   * POST请求
   * @param {String} url - 请求地址
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求配置
   * @returns {Promise} - 返回Promise
   */
  post(url, data, options = {}) {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  /**
   * PUT请求
   * @param {String} url - 请求地址
   * @param {Object} data - 请求数据
   * @param {Object} options - 请求配置
   * @returns {Promise} - 返回Promise
   */
  put(url, data, options = {}) {
    return this.fetch(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  /**
   * DELETE请求
   * @param {String} url - 请求地址
   * @param {Object} options - 请求配置
   * @returns {Promise} - 返回Promise
   */
  delete(url, options = {}) {
    return this.fetch(url, { ...options, method: 'DELETE' });
  }
}

// 创建客户端实例
const api = new FetchClient({
  baseURL: 'http://jsonplaceholder.typicode.com',
  timeout: 5000,
  retries: 2,
  headers: {
    'X-API-Key': 'your-api-key'
  }
});

// 发起请求
api.get('/posts')
  .then((response) => response.json())
  .then((data) => console.log('成功:', data))
  .catch((error) => console.error('错误:', error));

// 取消请求
// fetchWrapper.abort();
