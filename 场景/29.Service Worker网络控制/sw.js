// Service Worker 版本号，用于强制更新
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `network-control-${CACHE_VERSION}`;

// 需要预缓存的资源
const PRECACHE_URLS = [
    './',
    './index.html',
    './main.js',
    './styles.css'
];

// 不同类型资源的缓存策略
const CACHE_STRATEGIES = {
    API: 'network-first',      // API 请求：网络优先
    IMAGE: 'cache-first',      // 图片：缓存优先  
    STATIC: 'cache-first',     // 静态资源：缓存优先
    HTML: 'network-first'      // HTML：网络优先
};

// Service Worker 安装事件
self.addEventListener('install', (event) => {
    console.log('[SW] 正在安装 Service Worker', CACHE_VERSION);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] 预缓存资源');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[SW] 跳过等待，立即激活');
                return self.skipWaiting();
            })
    );
});

// Service Worker 激活事件
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker 已激活', CACHE_VERSION);
    
    event.waitUntil(
        Promise.all([
            // 清理旧版本缓存
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] 删除旧缓存:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // 立即控制所有客户端
            self.clients.claim()
        ])
    );
});

// 网络请求拦截事件 - 这是核心功能
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    console.log('[SW] 拦截请求:', request.method, url.pathname);
    
    // 只处理 GET 请求
    if (request.method !== 'GET') {
        console.log('[SW] 忽略非 GET 请求');
        return;
    }
    
    // 根据请求类型选择缓存策略
    const strategy = getRequestStrategy(request);
    console.log('[SW] 使用策略:', strategy);
    
    event.respondWith(
        handleRequest(request, strategy)
    );
});

// 获取请求的缓存策略
function getRequestStrategy(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // API 请求
    if (pathname.startsWith('/api/')) {
        return CACHE_STRATEGIES.API;
    }
    
    // 图片资源
    if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return CACHE_STRATEGIES.IMAGE;
    }
    
    // 静态资源 (CSS, JS)
    if (pathname.match(/\.(css|js)$/i)) {
        return CACHE_STRATEGIES.STATIC;
    }
    
    // HTML 页面
    if (pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.')) {
        return CACHE_STRATEGIES.HTML;
    }
    
    // 默认使用网络优先
    return CACHE_STRATEGIES.API;
}

// 根据策略处理请求
async function handleRequest(request, strategy) {
    switch (strategy) {
        case 'cache-first':
            return cacheFirst(request);
        case 'network-first':
            return networkFirst(request);
        case 'cache-only':
            return cacheOnly(request);
        case 'network-only':
            return networkOnly(request);
        default:
            return networkFirst(request);
    }
}

// 缓存优先策略
async function cacheFirst(request) {
    try {
        // 先从缓存查找
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('[SW] 从缓存返回:', request.url);
            
            // 在响应头中标记来源
            const response = cachedResponse.clone();
            response.headers.set('X-From-Cache', 'cache');
            
            // 在后台更新缓存（可选）
            updateCacheInBackground(request, cache);
            
            return response;
        }
        
        // 缓存不存在，发起网络请求
        console.log('[SW] 缓存未命中，发起网络请求:', request.url);
        const networkResponse = await fetch(request);
        
        // 缓存网络响应
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
            console.log('[SW] 已缓存网络响应:', request.url);
        }
        
        // 在响应头中标记来源
        const response = networkResponse.clone();
        response.headers.set('X-From-Cache', 'network');
        
        return response;
        
    } catch (error) {
        console.error('[SW] 缓存优先策略失败:', error);
        return createErrorResponse(request, error);
    }
}

// 网络优先策略
async function networkFirst(request) {
    try {
        // 先尝试网络请求
        console.log('[SW] 发起网络请求:', request.url);
        const networkResponse = await fetch(request);
        
        // 网络请求成功，缓存响应
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, networkResponse.clone());
            console.log('[SW] 已缓存网络响应:', request.url);
        }
        
        // 在响应头中标记来源
        const response = networkResponse.clone();
        response.headers.set('X-From-Cache', 'network');
        
        return response;
        
    } catch (error) {
        console.warn('[SW] 网络请求失败，尝试从缓存返回:', error);
        
        // 网络失败，从缓存返回
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('[SW] 从缓存返回（网络失败）:', request.url);
            
            // 在响应头中标记来源
            const response = cachedResponse.clone();
            response.headers.set('X-From-Cache', 'cache-fallback');
            
            return response;
        }
        
        // 缓存也没有，返回错误响应
        console.error('[SW] 网络和缓存都失败:', request.url);
        return createErrorResponse(request, error);
    }
}

// 仅缓存策略
async function cacheOnly(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        console.log('[SW] 从缓存返回（仅缓存）:', request.url);
        const response = cachedResponse.clone();
        response.headers.set('X-From-Cache', 'cache-only');
        return response;
    }
    
    console.warn('[SW] 缓存未找到（仅缓存）:', request.url);
    return createErrorResponse(request, new Error('缓存中未找到资源'));
}

// 仅网络策略
async function networkOnly(request) {
    try {
        console.log('[SW] 发起网络请求（仅网络）:', request.url);
        const networkResponse = await fetch(request);
        
        const response = networkResponse.clone();
        response.headers.set('X-From-Cache', 'network-only');
        
        return response;
        
    } catch (error) {
        console.error('[SW] 网络请求失败（仅网络）:', error);
        return createErrorResponse(request, error);
    }
}

// 后台更新缓存
async function updateCacheInBackground(request, cache) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
            console.log('[SW] 后台更新缓存成功:', request.url);
        }
    } catch (error) {
        console.warn('[SW] 后台更新缓存失败:', error);
    }
}

// 创建错误响应
function createErrorResponse(request, error) {
    const url = new URL(request.url);
    
    // 为 API 请求创建 JSON 错误响应
    if (url.pathname.startsWith('/api/')) {
        return new Response(
            JSON.stringify({
                error: '网络请求失败',
                message: error.message,
                timestamp: Date.now(),
                url: request.url
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: {
                    'Content-Type': 'application/json',
                    'X-From-Cache': 'error'
                }
            }
        );
    }
    
    // 为其他请求创建简单的错误响应
    return new Response(
        `资源加载失败: ${request.url}\n错误: ${error.message}`,
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'text/plain',
                'X-From-Cache': 'error'
            }
        }
    );
}

// 处理来自主线程的消息
self.addEventListener('message', (event) => {
    console.log('[SW] 收到消息:', event.data);
    
    const { type, payload } = event.data;
    
    switch (type) {
        case 'CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0].postMessage({ type: 'CACHE_STATUS_RESPONSE', payload: status });
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
            });
            break;
            
        default:
            console.warn('[SW] 未知消息类型:', type);
    }
});

// 获取缓存状态
async function getCacheStatus() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        
        return {
            cacheName: CACHE_NAME,
            cacheSize: keys.length,
            cachedUrls: keys.map(request => request.url)
        };
    } catch (error) {
        return { error: error.message };
    }
}

// 清空所有缓存
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('[SW] 所有缓存已清空');
    } catch (error) {
        console.error('[SW] 清空缓存失败:', error);
    }
}