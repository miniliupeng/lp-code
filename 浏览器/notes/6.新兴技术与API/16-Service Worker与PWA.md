# 16-Service Worker 与 PWA

## 1. Service Worker: PWA 的心脏

**Service Worker** 是一个在浏览器后台独立于网页运行的**事件驱动型**脚本。它扮演着一个**网络代理**的角色，能够拦截、处理和响应页面发出的网络请求。这项能力是实现 PWA（渐进式 Web 应用）诸多核心功能的基石。

与普通的 Web Worker 相比，Service Worker（简称 SW）具有更强大的能力和更特殊的生命周期。

### a. 核心特性

*   **后台运行**：SW 在其作用域下的页面关闭后，依然可以在后台运行。
*   **网络代理**：通过 `fetch` 事件，可以拦截网络请求，从而实现离线缓存、自定义响应等功能。
*   **无法访问 DOM**：和 Web Worker 一样，SW 无法直接操作 DOM。它通过 `postMessage` API 与页面进行通信。
*   **必须在 HTTPS 环境下运行**：出于安全考虑，Service Worker 只能在 HTTPS 协议的网站上注册和使用（`localhost` 除外）。

### b. 生命周期 (Lifecycle)

Service Worker 的生命周期是其最重要也最复杂的概念之一，它独立于页面，由浏览器严格控制。

1.  **注册 (Register)**
    *   在主线程的 JS 中，我们首先检查浏览器是否支持 SW，然后调用 `navigator.serviceWorker.register()` 来注册一个 SW 脚本。
    *   ```javascript
        // main.js
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('Service Worker registered:', registration))
            .catch(error => console.log('Service Worker registration failed:', error));
        }
        ```
    *   `register()` 方法会返回一个 Promise，并且**每次页面加载时都会执行**。浏览器会智能地判断 SW 脚本文件是否有变化，只有在文件内容发生改变时，才会触发后续的安装和激活流程。

2.  **安装 (Install)**
    *   注册成功后，浏览器会下载并解析 SW 脚本，触发其内部的 `install` 事件。
    *   `install` 事件只会在 SW **首次注册**或**脚本文件更新**时触发一次。
    *   这是进行**静态资源缓存**的最佳时机。我们可以使用 **Cache API** 将应用的外壳（App Shell）——如 HTML, CSS, JS, 图片等——缓存起来。
    *   在 `install` 事件中，可以通过 `event.waitUntil()` 方法来延长事件的生命周期，直到传入的 Promise 完成。这可以确保在 SW 安装完成之前，所有核心资源都已被成功缓存。
    *   ```javascript
        // sw.js
        const CACHE_NAME = 'my-app-cache-v1';
        const urlsToCache = ['/', '/styles/main.css', '/script/main.js'];

        self.addEventListener('install', event => {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
              })
          );
        });
        ```

3.  **激活 (Activate)**
    *   当 SW 安装成功后，它会进入 `waiting` 状态，等待旧的、当前正控制页面的 SW 终止。
    *   一旦旧的 SW 停止工作（例如用户关闭了所有相关的标签页），新的 SW 就会接管控制权，并触发 `activate` 事件。
    *   `activate` 事件是**清理旧缓存**的最佳时机。我们可以在这里遍历所有的缓存，删除那些不再需要的旧版本缓存。
    *   同样，`event.waitUntil()` 也可以用来确保清理工作完成后再处理其他事件。
    *   ```javascript
        // sw.js
        self.addEventListener('activate', event => {
          const cacheWhitelist = ['my-app-cache-v1'];
          event.waitUntil(
            caches.keys().then(cacheNames => {
              return Promise.all(
                cacheNames.map(cacheName => {
                  if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                  }
                })
              );
            })
          );
        });
        ```

### c. 核心事件：`fetch`

`fetch` 事件是 Service Worker 发挥网络代理能力的核心。当 SW 激活并控制页面后，页面上发出的任何网络请求（`fetch` API, `<img>` 标签, XHR 等）都会触发 SW 中的 `fetch` 事件。

在这个事件的回调函数中，我们可以：
*   **拦截请求**：通过 `event.request` 对象获取请求的详细信息。
*   **自定义响应**：通过 `event.respondWith()` 方法返回一个自定义的 `Response` 对象。

**缓存优先 (Cache First) 策略示例：**
```javascript
// sw.js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到了匹配的响应，则直接返回它
        if (response) {
          return response;
        }
        // 否则，发起网络请求，并让浏览器正常处理
        return fetch(event.request);
      })
  );
});
```
通过这种方式，我们可以轻松实现离线访问。如果资源在缓存中，即使用户断网，页面依然可以从缓存中加载并显示。

## 2. PWA (Progressive Web Apps) - 渐进式 Web 应用

PWA 不是一项单一的技术，而是一套**理念和技术的集合**，其目标是让 Web 应用拥有接近原生应用的体验。Service Worker 是实现 PWA 的技术核心，但一个完整的 PWA 还需要满足其他几个条件。

### a. PWA 的核心特征

*   **可靠 (Reliable)**：通过 Service Worker 实现离线或在弱网环境下也能快速加载和使用。
*   **快速 (Fast)**：对用户交互提供快速响应，动画流畅。
*   **可安装 (Installable)**：通过 **Web App Manifest** 文件，用户可以将应用“添加至主屏幕”，像原生应用一样拥有独立的图标和启动体验。
*   **吸引人 (Engaging)**：通过 **推送通知 (Push Notifications)** 等功能，可以主动与用户互动，提升用户粘性。

### b. Web App Manifest (应用清单文件)

*   这是一个简单的 `manifest.json` 文件，用于向浏览器提供关于该 Web 应用的元数据信息。
*   **内容**：包括应用的名称 (`name`, `short_name`)、图标 (`icons`)、启动 URL (`start_url`)、显示模式 (`display`: `standalone`, `fullscreen` 等)、主题颜色 (`theme_color`) 等。
*   **作用**：浏览器根据这个文件来展示“添加到主屏幕”的提示，并决定应用安装后的外观和行为。

```json
{
  "short_name": "My App",
  "name": "My Awesome App",
  "icons": [
    {
      "src": "/images/icons-192.png",
      "type": "image/png",
      "sizes": "192x192"
    }
  ],
  "start_url": "/?source=pwa",
  "display": "standalone",
  "theme_color": "#3367D6"
}
```

通过将 Service Worker（负责可靠性）、Web App Manifest（负责可安装性）以及其他 Web 技术（如 HTTPS、响应式设计）结合起来，我们就能构建出一个完整的、体验优秀的 PWA。
