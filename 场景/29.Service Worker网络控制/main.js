// Service Worker 注册和管理
let registration = null;

// 页面加载时检查 Service Worker 状态
window.addEventListener('load', async () => {
    await checkSWStatus();
    
    // 监听 Service Worker 消息
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            logMessage(`收到 SW 消息: ${JSON.stringify(event.data)}`);
        });
    }
});

// 检查 Service Worker 状态
async function checkSWStatus() {
    const statusEl = document.getElementById('sw-status');
    
    if (!('serviceWorker' in navigator)) {
        statusEl.textContent = '浏览器不支持 Service Worker';
        statusEl.className = 'status error';
        return;
    }
    
    try {
        registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
            statusEl.textContent = `Service Worker 已注册，状态: ${registration.active ? '活跃' : '未激活'}`;
            statusEl.className = 'status success';
        } else {
            statusEl.textContent = 'Service Worker 未注册';
            statusEl.className = 'status error';
        }
    } catch (error) {
        statusEl.textContent = `检查状态失败: ${error.message}`;
        statusEl.className = 'status error';
    }
}

// 注册 Service Worker
async function registerSW() {
    const statusEl = document.getElementById('sw-status');
    
    try {
        registration = await navigator.serviceWorker.register('./sw.js');
        
        logMessage('Service Worker 注册成功');
        
        // 等待 Service Worker 激活
        if (registration.installing) {
            logMessage('Service Worker 正在安装...');
            await waitForActivation(registration.installing);
        } else if (registration.waiting) {
            logMessage('Service Worker 正在等待激活...');
            await waitForActivation(registration.waiting);
        }
        
        statusEl.textContent = 'Service Worker 注册并激活成功';
        statusEl.className = 'status success';
        
    } catch (error) {
        logMessage(`Service Worker 注册失败: ${error.message}`);
        statusEl.textContent = `注册失败: ${error.message}`;
        statusEl.className = 'status error';
    }
}

// 等待 Service Worker 激活
function waitForActivation(serviceWorker) {
    return new Promise((resolve) => {
        serviceWorker.addEventListener('statechange', () => {
            if (serviceWorker.state === 'activated') {
                resolve();
            }
        });
    });
}

// 注销 Service Worker
async function unregisterSW() {
    const statusEl = document.getElementById('sw-status');
    
    try {
        if (registration) {
            await registration.unregister();
            registration = null;
            statusEl.textContent = 'Service Worker 已注销';
            statusEl.className = 'status';
            logMessage('Service Worker 注销成功');
        } else {
            statusEl.textContent = '没有需要注销的 Service Worker';
            statusEl.className = 'status error';
        }
    } catch (error) {
        logMessage(`Service Worker 注销失败: ${error.message}`);
        statusEl.textContent = `注销失败: ${error.message}`;
        statusEl.className = 'status error';
    }
}

// 测试 API 请求
async function fetchAPI() {
    logMessage('发起 API 请求...');
    
    try {
        const response = await fetch('/api/test-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Request-Time': Date.now().toString()
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            logMessage(`API 请求成功: ${JSON.stringify(data)}`);
        } else {
            logMessage(`API 请求失败: ${response.status} ${response.statusText}`);
        }
        
        // 记录响应来源
        const fromCache = response.headers.get('X-From-Cache');
        if (fromCache) {
            logMessage(`响应来自: ${fromCache}`);
        }
        
    } catch (error) {
        logMessage(`API 请求异常: ${error.message}`);
    }
}

// 测试图片加载
async function fetchImage() {
    logMessage('加载测试图片...');
    
    try {
        const imageUrl = 'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 1000);
        const response = await fetch(imageUrl);
        
        if (response.ok) {
            const blob = await response.blob();
            const imageElement = document.getElementById('test-image');
            imageElement.src = URL.createObjectURL(blob);
            imageElement.style.display = 'block';
            
            logMessage('图片加载成功');
            
            // 记录响应来源
            const fromCache = response.headers.get('X-From-Cache');
            if (fromCache) {
                logMessage(`图片来自: ${fromCache}`);
            }
        } else {
            logMessage(`图片加载失败: ${response.status}`);
        }
        
    } catch (error) {
        logMessage(`图片加载异常: ${error.message}`);
    }
}

// 测试 CSS 加载
async function fetchCSS() {
    logMessage('加载 CSS 文件...');
    
    try {
        const response = await fetch('./styles.css');
        
        if (response.ok) {
            const css = await response.text();
            logMessage(`CSS 加载成功，大小: ${css.length} 字符`);
            
            // 动态应用 CSS
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            
            // 记录响应来源
            const fromCache = response.headers.get('X-From-Cache');
            if (fromCache) {
                logMessage(`CSS 来自: ${fromCache}`);
            }
        } else {
            logMessage(`CSS 加载失败: ${response.status}`);
        }
        
    } catch (error) {
        logMessage(`CSS 加载异常: ${error.message}`);
    }
}

// 清空缓存
async function clearCache() {
    logMessage('清空缓存...');
    
    try {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            
            for (const cacheName of cacheNames) {
                await caches.delete(cacheName);
                logMessage(`删除缓存: ${cacheName}`);
            }
            
            logMessage('所有缓存已清空');
        } else {
            logMessage('浏览器不支持 Cache API');
        }
        
    } catch (error) {
        logMessage(`清空缓存失败: ${error.message}`);
    }
}

// 记录日志
function logMessage(message) {
    const logEl = document.getElementById('log');
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    logEl.textContent += logEntry;
    logEl.scrollTop = logEl.scrollHeight;
    
    console.log(logEntry);
}

// 清空日志
function clearLog() {
    document.getElementById('log').textContent = '';
}