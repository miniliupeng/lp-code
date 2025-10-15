// 简单版本 - 基础用法
function simplePost(url, data) {
  const xhr = new XMLHttpRequest();
  // 1. 配置请求
  xhr.open('POST', url, true); // true 表示异步
  
  // 2. 设置请求头
  xhr.setRequestHeader('Content-Type', 'application/json');
  
  // 3. 监听状态变化
  xhr.onreadystatechange = function() {
    // readyState === 4 表示请求完成
    // status === 200 表示成功
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log('成功:', xhr.responseText);
    }
  };
  
  // 4. 发送请求
  xhr.send(JSON.stringify(data));
}

// 使用示例
// simplePost('https://api.example.com/data', { name: '张三', age: 25 });


// ========================================
// 核心知识点总结：
/*
1. XMLHttpRequest 的核心步骤：
   - new XMLHttpRequest() 创建对象
   - open() 配置请求
   - setRequestHeader() 设置请求头
   - onreadystatechange 监听状态
   - send() 发送请求

2. readyState 状态值：
   - 0: UNSENT - 未初始化
   - 1: OPENED - 已调用 open()
   - 2: HEADERS_RECEIVED - 已接收响应头
   - 3: LOADING - 正在接收响应体
   - 4: DONE - 请求完成

3. 常见 HTTP 状态码：
   - 200: 成功
   - 201: 已创建
   - 400: 请求错误
   - 401: 未授权
   - 404: 未找到
   - 500: 服务器错误

4. 面试常问：
   - XHR vs Fetch 的区别
   - 如何处理超时
   - 如何取消请求 (xhr.abort())
   - 如何监听上传进度 (xhr.upload.onprogress)
*/


// ========================================
// XHR vs Fetch 的区别

/*
┌─────────────────┬──────────────────────────┬──────────────────────────┐
│   对比项        │         XHR              │         Fetch            │
├─────────────────┼──────────────────────────┼──────────────────────────┤
│ 1. 语法         │ 基于回调，较复杂         │ 基于 Promise，更简洁     │
│ 2. 兼容性       │ 所有浏览器都支持         │ IE 不支持                │
│ 3. 超时处理     │ xhr.timeout 原生支持     │ 需要手动实现             │
│ 4. 取消请求     │ xhr.abort() 原生支持     │ 需要 AbortController     │
│ 5. 进度监听     │ xhr.onprogress 支持      │ 不支持                   │
│ 6. 错误处理     │ 网络错误会触发 onerror   │ 只有网络错误才 reject    │
│                 │                          │ HTTP 错误码不会 reject   │
│ 7. Cookie       │ 默认携带                 │ 需设置 credentials       │
│ 8. 返回值       │ 通过回调函数获取         │ 返回 Promise             │
└─────────────────┴──────────────────────────┴──────────────────────────┘

核心区别：

1️⃣ 语法差异：
   XHR:  需要手动设置回调函数，代码冗长
   Fetch: 返回 Promise，可以用 async/await，代码简洁

2️⃣ 错误处理：
   XHR:  任何错误都会触发回调
   Fetch: 只有网络错误才会 reject，HTTP 404/500 等仍然 resolve

3️⃣ 功能差异：
   XHR:  支持超时、进度监听、请求中断
   Fetch: 默认不支持这些功能，需要额外实现

示例对比：
*/

// XHR 实现
function xhrPost(url, data) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.timeout = 5000; // 原生支持超时
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
    }
  };
  
  xhr.send(JSON.stringify(data));
}

// Fetch 实现
async function fetchPost(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  // 注意：必须手动检查 status
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

/*
面试建议：
- 如果需要兼容 IE，或需要监听进度/超时，用 XHR
- 如果追求代码简洁、现代化，用 Fetch
- 实际项目中推荐用 axios（基于 XHR 封装，兼具两者优点）
*/

