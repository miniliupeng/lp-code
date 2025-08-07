# Service Worker 网络请求控制示例

这个示例演示了如何使用 Service Worker 完全控制网络请求，实现不同的缓存策略。

## 核心概念

### Service Worker 生命周期

1. **注册 (Registration)**: 浏览器下载并注册 Service Worker 文件
2. **安装 (Install)**: Service Worker 开始安装，可以预缓存资源
3. **激活 (Activate)**: Service Worker 激活，开始控制页面
4. **控制 (Controlling)**: Service Worker 拦截并处理网络请求

### 网络请求拦截

Service Worker 通过 `fetch` 事件拦截所有网络请求：

```javascript
self.addEventListener('fetch', (event) => {
    // 拦截请求
    const request = event.request;
    
    // 完全控制响应
    event.respondWith(
        handleRequest(request)
    );
});
```

## 缓存策略

### 1. 缓存优先 (Cache First)

适用于：静态资源（CSS、JS、图片）

```javascript
async function cacheFirst(request) {
    // 1. 先查找缓存
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse; // 从缓存返回
    }
    
    // 2. 缓存不存在，发起网络请求
    const networkResponse = await fetch(request);
    
    // 3. 缓存网络响应
    await cache.put(request, networkResponse.clone());
    
    return networkResponse;
}
```

**优点**: 加载速度快，减少网络请求
**缺点**: 可能返回过期内容

### 2. 网络优先 (Network First)

适用于：API 请求、HTML 页面

```javascript
async function networkFirst(request) {
    try {
        // 1. 先尝试网络请求
        const networkResponse = await fetch(request);
        
        // 2. 缓存成功的响应
        await cache.put(request, networkResponse.clone());
        
        return networkResponse;
    } catch (error) {
        // 3. 网络失败时从缓存返回
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}
```

**优点**: 总是尝试获取最新内容
**缺点**: 网络差时加载慢

### 3. 仅缓存 (Cache Only)

适用于：离线模式、特定的静态资源

```javascript
async function cacheOnly(request) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    throw new Error('资源不在缓存中');
}
```

### 4. 仅网络 (Network Only)

适用于：实时数据、用户敏感信息

```javascript
async function networkOnly(request) {
    return fetch(request);
}
```

## 文件说明

### index.html
- 主页面，包含测试界面
- 展示 Service Worker 状态
- 提供各种网络请求测试按钮

### main.js
- 处理 Service Worker 注册和状态管理
- 发起各种类型的网络请求
- 显示请求日志和结果

### sw.js
- Service Worker 核心文件
- 实现网络请求拦截和缓存策略
- 处理不同类型资源的缓存逻辑

### styles.css
- 测试用的 CSS 文件
- 用于演示静态资源的缓存策略

## 使用方法

1. **启动本地服务器**（Service Worker 需要 HTTPS 或 localhost）:
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 或使用 Node.js
   npx serve .
   
   # 或使用 PHP
   php -S localhost:8000
   ```

2. **打开浏览器**访问 `http://localhost:8000`

3. **注册 Service Worker**点击"注册 Service Worker"按钮

4. **测试网络请求**:
   - 点击"获取 API 数据"测试 API 缓存
   - 点击"加载图片"测试图片缓存
   - 点击"加载 CSS"测试静态资源缓存

5. **观察缓存行为**:
   - 查看请求日志了解缓存策略
   - 断网测试离线功能
   - 清空缓存测试重新获取

## 调试技巧

### Chrome DevTools

1. **Application 面板**:
   - 查看 Service Worker 状态
   - 管理缓存存储
   - 模拟离线状态

2. **Network 面板**:
   - 查看请求来源（网络/缓存）
   - 观察请求头中的 `X-From-Cache` 标记

3. **Console 面板**:
   - 查看 Service Worker 日志
   - 监控缓存操作

### 常用调试命令

```javascript
// 查看缓存状态
caches.keys().then(console.log);

// 查看特定缓存内容
caches.open('cache-name').then(cache => 
    cache.keys().then(console.log)
);

// 清空所有缓存
caches.keys().then(names => 
    Promise.all(names.map(name => caches.delete(name)))
);
```

## 实际应用场景

### 1. PWA 应用
- 实现离线功能
- 提升加载性能
- 减少网络依赖

### 2. 静态资源优化
- 缓存 CSS、JS、图片
- 减少重复下载
- 加快页面渲染

### 3. API 数据缓存
- 缓存不频繁变化的数据
- 提供离线查看能力
- 优化用户体验

### 4. 渐进式增强
- 网络正常时获取最新内容
- 网络异常时提供缓存内容
- 平滑的降级体验

## 注意事项

1. **HTTPS 要求**: Service Worker 只能在 HTTPS 或 localhost 下工作
2. **作用域限制**: Service Worker 只能控制其作用域内的请求
3. **缓存管理**: 需要合理管理缓存大小和过期策略
4. **更新策略**: 要考虑 Service Worker 自身的更新机制
5. **浏览器兼容性**: 检查目标浏览器的支持情况

## 扩展功能

可以进一步扩展的功能：

- 添加缓存过期机制
- 实现后台同步
- 添加推送通知
- 实现更复杂的缓存策略
- 添加性能监控和分析