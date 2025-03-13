# 客户界面白屏问题排查指南

## 1. 分析白屏类型

### 1.1 完全白屏
- 页面完全空白，无任何内容
- 通常是JavaScript错误或资源加载失败

### 1.2 首屏白屏
- 首屏加载时间过长
- 可能是资源过大或渲染阻塞

### 1.3 局部白屏
- 页面部分区域空白
- 可能是组件渲染错误或数据加载问题

## 2. 客户端快速检查

### 2.1 浏览器控制台检查
```
1. 指导客户按F12打开开发者工具
2. 查看Console面板中的错误信息
3. 记录具体错误信息和行号
```

### 2.2 网络状况检查
```
1. 检查客户网络连接是否正常
2. 尝试访问其他网站验证网络连通性
3. 检查是否使用VPN或代理服务
```

### 2.3 浏览器兼容性
```
1. 确认客户使用的浏览器类型和版本
2. 尝试使用其他浏览器访问
3. 检查是否启用了必要的浏览器功能(如JavaScript)
```

## 3. 远程诊断方法

### 3.1 获取关键信息
```
1. 浏览器类型和版本
2. 操作系统类型和版本
3. 网络环境(家庭/公司网络、移动数据)
4. 问题发生的具体时间
5. 问题是否可复现
```

### 3.2 请求截图或录屏
```
1. 请客户提供白屏页面的截图
2. 如可能，请客户录制重现问题的过程
3. 请客户提供控制台错误截图
```

### 3.3 远程会话工具
```
1. 使用TeamViewer、Zoom等远程控制工具
2. 直接查看客户环境中的问题
3. 实时进行问题排查
```

## 4. 常见白屏原因及解决方案

### 4.1 JavaScript错误

**症状**:
- 控制台有JS错误
- 页面加载到一半停止

**排查**:
```javascript
// 检查是否有全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
  console.log('捕获到错误:', message, source, lineno);
  // 上报错误信息
}

// 检查Promise错误
window.addEventListener('unhandledrejection', function(event) {
  console.log('未处理的Promise拒绝:', event.reason);
});
```

**解决方案**:
- 修复具体JavaScript错误
- 添加错误边界防止整页崩溃
- 实现优雅降级

### 4.2 资源加载失败

**症状**:
- 控制台有404/500错误
- 页面结构加载但无样式或交互

**排查**:
```
1. 检查Network面板中资源加载状态
2. 查看关键资源(CSS/JS)是否有404或5xx错误
3. 检查资源路径是否正确
```

**解决方案**:
- 修复资源路径
- 检查CDN配置
- 添加资源加载失败处理

### 4.3 跨域问题

**症状**:
- 控制台有CORS错误
- API请求失败

**排查**:
```
1. 检查控制台中是否有CORS相关错误
2. 查看Network面板中API请求的响应头
3. 确认是否有正确的Access-Control-Allow-Origin头
```

**解决方案**:
- 配置正确的CORS头
- 使用代理服务器
- 检查前端请求配置

### 4.4 渲染阻塞

**症状**:
- 页面加载时间过长
- 白屏后突然显示完整内容

**排查**:
```
1. 检查Performance面板中的渲染过程
2. 查看大型JavaScript执行时间
3. 分析关键渲染路径
```

**解决方案**:
- 优化JavaScript执行
- 实现代码分割
- 添加骨架屏或加载指示器

### 4.5 内存溢出

**症状**:
- 页面卡顿后白屏
- 控制台可能有内存相关警告

**排查**:
```
1. 检查Memory面板中的内存使用情况
2. 查找可能的内存泄漏
3. 检查大型数据处理逻辑
```

**解决方案**:
- 优化数据处理逻辑
- 实现虚拟列表
- 减少不必要的状态存储

## 5. 前端监控与预防

### 5.1 错误监控
```javascript
// 前端错误监控
class ErrorMonitor {
  init() {
    // 捕获JS错误
    window.addEventListener('error', this.handleError.bind(this));
    
    // 捕获Promise错误
    window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
    
    // 捕获资源加载错误
    document.addEventListener('error', this.handleResourceError.bind(this), true);
  }
  
  handleError(event) {
    this.report({
      type: 'js_error',
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  }
  
  handlePromiseError(event) {
    this.report({
      type: 'promise_error',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack
    });
  }
  
  handleResourceError(event) {
    if (event.target.tagName) {
      this.report({
        type: 'resource_error',
        element: event.target.tagName.toLowerCase(),
        source: event.target.src || event.target.href
      });
    }
  }
  
  report(data) {
    // 上报到服务器
    navigator.sendBeacon('/api/error-report', JSON.stringify(data));
  }
}

// 初始化
new ErrorMonitor().init();
```

### 5.2 性能监控
```javascript
// 性能监控
function reportPerformance() {
  const timing = performance.timing;
  const performanceData = {
    // DNS查询时间
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    
    // TCP连接时间
    tcp: timing.connectEnd - timing.connectStart,
    
    // 请求时间
    request: timing.responseStart - timing.requestStart,
    
    // 响应时间
    response: timing.responseEnd - timing.responseStart,
    
    // DOM解析时间
    domParse: timing.domInteractive - timing.responseEnd,
    
    // DOM Ready时间
    domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
    
    // 页面完全加载时间
    load: timing.loadEventEnd - timing.navigationStart,
    
    // 首次绘制时间
    fpt: performance.getEntriesByType('paint')[0]?.startTime || 0,
    
    // 首次内容绘制时间
    fcp: performance.getEntriesByType('paint')[1]?.startTime || 0
  };
  
  // 上报性能数据
  navigator.sendBeacon('/api/performance', JSON.stringify(performanceData));
}

// 页面加载完成后上报
window.addEventListener('load', () => {
  // 延迟上报，确保数据准确
  setTimeout(reportPerformance, 0);
});
```

### 5.3 用户行为追踪
```javascript
// 用户行为追踪
class UserBehaviorTracker {
  constructor() {
    this.events = [];
    this.maxEvents = 100;
  }
  
  init() {
    // 记录页面访问
    this.trackEvent('page_view', {
      url: location.href,
      referrer: document.referrer
    });
    
    // 记录用户点击
    document.addEventListener('click', this.handleClick.bind(this));
    
    // 记录路由变化
    window.addEventListener('popstate', this.handleRouteChange.bind(this));
    
    // 页面离开时上报
    window.addEventListener('beforeunload', this.reportEvents.bind(this));
  }
  
  handleClick(event) {
    const target = event.target;
    this.trackEvent('click', {
      tag: target.tagName.toLowerCase(),
      id: target.id,
      class: target.className,
      text: target.innerText?.substring(0, 50)
    });
  }
  
  handleRouteChange() {
    this.trackEvent('route_change', {
      url: location.href
    });
  }
  
  trackEvent(type, data) {
    this.events.push({
      type,
      data,
      timestamp: Date.now()
    });
    
    // 限制事件数量
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }
  
  reportEvents() {
    navigator.sendBeacon('/api/user-behavior', JSON.stringify(this.events));
  }
}

// 初始化
new UserBehaviorTracker().init();
```

## 6. 白屏预防策略

### 6.1 骨架屏
```html
<!-- 骨架屏示例 -->
<div id="app">
  <!-- 骨架屏，在JS加载前显示 -->
  <div class="skeleton">
    <div class="skeleton-header"></div>
    <div class="skeleton-content">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    </div>
  </div>
</div>

<style>
  .skeleton {
    padding: 15px;
  }
  .skeleton-header {
    height: 40px;
    background: #f2f2f2;
    margin-bottom: 15px;
  }
  .skeleton-line {
    height: 20px;
    background: #f2f2f2;
    margin-bottom: 10px;
  }
</style>
```

### 6.2 错误边界
```jsx
// React错误边界示例
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 上报错误
    reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 显示备用UI
      return <h1>出错了，请刷新页面重试</h1>;
    }

    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### 6.3 资源预加载
```html
<!-- 关键资源预加载 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="main.js" as="script">

<!-- 预连接 -->
<link rel="preconnect" href="https://api.example.com">

<!-- DNS预解析 -->
<link rel="dns-prefetch" href="https://cdn.example.com">
```

### 6.4 渐进式加载
```javascript
// 代码分割示例
// 主要功能立即加载
import MainFeature from './MainFeature';

// 次要功能懒加载
const SecondaryFeature = React.lazy(() => import('./SecondaryFeature'));

function App() {
  return (
    <div>
      <MainFeature />
      <React.Suspense fallback={<div>Loading...</div>}>
        <SecondaryFeature />
      </React.Suspense>
    </div>
  );
}
```

## 7. 系统性排查流程

### 7.1 客户端排查流程
1. 确认问题范围（全部用户/部分用户）
2. 检查浏览器控制台错误
3. 检查网络请求状态
4. 验证浏览器兼容性
5. 尝试清除缓存和Cookie
6. 尝试无痕模式访问

### 7.2 服务端排查流程
1. 检查服务器日志
2. 检查API响应状态
3. 验证数据库连接
4. 检查服务器负载
5. 查看CDN状态
6. 检查第三方服务依赖

### 7.3 构建和部署排查
1. 检查最近代码变更
2. 验证构建产物完整性
3. 检查静态资源完整性
4. 验证环境变量配置
5. 回滚到上一个稳定版本测试

## 8. 长期解决方案

### 8.1 监控系统建设
- 前端错误监控
- 性能监控
- 用户行为分析
- 实时告警机制

### 8.2 测试策略完善
- 单元测试
- 集成测试
- E2E测试
- 兼容性测试

### 8.3 发布流程优化
- 灰度发布
- A/B测试
- 自动化回滚机制
- 发布前检查清单

### 8.4 文档和培训
- 问题排查手册
- 常见问题解决方案
- 客服人员培训
- 用户自助排查指南

通过以上系统性的排查和预防措施，可以有效减少白屏问题的发生，并在问题出现时快速定位和解决。
