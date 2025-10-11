# 15-网络知识深化：DNS、CDN与Fetch

本章我们将深入探讨三个与前端性能和开发实践紧密相关的高阶网络主题：DNS 预解析、CDN 工作原理，以及现代化的 Fetch API。

## 1. DNS 预解析 (DNS Prefetching)

我们在“URL输入到页面展现的全过程”中了解到，DNS 解析是将域名转换为 IP 地址的过程，这个过程可能会消耗几十到上百毫秒的时间。如果我们的主站 `a.com` 依赖了多个不同域名的静态资源（例如 `static.b.com`）或 API（例如 `api.c.com`），那么浏览器在请求这些资源时，需要依次对每个新域名进行 DNS 查询，从而累积了显著的延迟。

**DNS 预解析**是一种浏览器优化技术，它允许浏览器在后台**并行地、提前地**解析这些未来可能会用到的域名，将解析结果缓存起来。这样，当后续真正需要请求这些域名下的资源时，就可以跳过 DNS 查询阶段，直接建立 TCP 连接，从而减少延迟，加快页面加载速度。

### 如何实现？

实现 DNS 预解析非常简单，只需在 HTML 页面的 `<head>` 标签中添加一个 `<link>` 标签即可：

```html
<head>
  <!-- 预解析静态资源域名 -->
  <link rel="dns-prefetch" href="//static.b.com">

  <!-- 预解析 API 域名 -->
  <link rel="dns-prefetch" href="//api.c.com">
</head>
```

**注意事项：**
*   `dns-prefetch` 只会对**跨域**的域名生效，对于当前主域名及其子域名，浏览器会自动进行解析，无需手动设置。
*   对于 HTTPS 页面，预解析会同时完成 DNS 查询和 TCP 握手，甚至 TLS 握手。这个增强版的 `dns-prefetch` 也被称为 **Preconnect**。如果你非常确定很快就会用到某个域名，使用 `preconnect` 会更激进、效果更好：
    ```html
    <link rel="preconnect" href="//api.c.com">
    ```
*   不要滥用。预解析过多的域名会消耗用户的网络和 CPU 资源，应只对那些一定会用到的、关键的跨域域名进行设置。

## 2. 资源加载提示 (Resource Hints)

除了 `dns-prefetch` 和 `preconnect`，浏览器还提供了一系列其他的 `<link>` 类型，让开发者可以更精细地控制资源的加载时机，从而优化关键渲染路径。

### a. Preload

*   **语法**: `<link rel="preload" href="/critical.js" as="script">`
*   **作用**: 告知浏览器，这是一个**当前页面导航周期内一定会用到**的关键资源，请**立即以高优先级下载**它，但**不要执行**。
*   **核心优势**:
    *   **解耦了下载与执行**：对于脚本，`preload` 会下载文件，但不会像 `<script>` 标签那样立即解析和执行，从而避免了阻塞渲染。当你在代码中需要这个脚本时（例如通过动态创建 `<script>` 标签），它已经存在于缓存中，可以立即执行。
    *   **提升优先级**：可以提升一些隐藏在 CSS 或 JS 文件深处的关键资源（如字体、背景图）的下载优先级。
*   **`as` 属性至关重要**: `as` 属性告知浏览器正在加载的资源类型，这有助于浏览器正确地设置请求优先级、内容安全策略（CSP）和 `Accept` 请求头。

### b. Prefetch

*   **语法**: `<link rel="prefetch" href="/next-page.js">`
*   **作用**: 告知浏览器，这是一个用户在**未来导航中（例如访问下一个页面）可能会用到**的资源。浏览器会在**空闲时**以**低优先级**下载该资源。
*   **核心优势**: 加速后续页面的加载体验。当用户点击链接跳转到下一个页面时，所需的某些资源可能已经存在于 HTTP 缓存中了。
*   **适用场景**: 预加载用户最有可能访问的下一个页面的资源、或者单页应用中下一个路由所需的组件。

### c. Prerender

*   **语法**: `<link rel="prerender" href="/next-page.html">`
*   **作用**: 这是一个重量级的提示。它会指示浏览器在后台**完整地加载并渲染**一个页面及其所有子资源。
*   **核心优势**: 如果用户最终导航到该页面，页面几乎可以瞬时呈现。
*   **缺点**: 资源消耗巨大，应只在你有极高把握用户会访问下一个页面时才使用。

### Resource Hints 对比

| 指令          | 作用范围         | 优先级 | 执行时机         | 适用场景                               |
| ------------- | ---------------- | -------- | ---------------- | -------------------------------------- |
| `dns-prefetch`| 跨域域名         | 最低     | 空闲时           | 预解析未来会用到的多个第三方域名       |
| `preconnect`  | 跨域域名         | 较高     | 立即             | 预连接很快会用到的关键 API 或 CDN 域名 |
| `preload`     | **当前页面**资源 | 最高     | 立即             | 加载当前页面一定会用到的关键资源       |
| `prefetch`    | **未来页面**资源 | 最低     | 空闲时           | 预加载下一个页面的资源                 |
| `prerender`   | **未来页面**     | 最低     | 空闲时           | 极高概率用户会访问的下一个完整页面     |

## 3. CDN 工作原理

**CDN (Content Delivery Network, 内容分发网络)** 是构建在现有互联网之上的一个智能虚拟网络。它的核心思想是**将源站的资源缓存到全球各地的“边缘节点（Edge Nodes）”服务器上**，让用户可以**就近**获取所需内容，从而避免网络拥堵、提高访问速度和稳定性。

### a. CDN 如何实现加速？

1.  **智能 DNS 解析**：
    *   当用户请求一个使用了 CDN 的域名时（例如 `static.b.com`），这个域名的 DNS 解析请求会被 CDN 的**智能 DNS 服务器**接管。
    *   智能 DNS 服务器会根据用户的**地理位置、运营商网络、节点负载情况**等因素，返回一个**离用户最近、访问速度最快**的**边缘节点**的 IP 地址。
2.  **边缘节点缓存**：
    *   用户的浏览器随后会向这个边缘节点发起资源请求。
    *   如果边缘节点**已经缓存**了该资源，并且缓存未过期，它会直接将资源返回给用户，完成一次高速的访问。
    *   如果边缘节点**没有缓存**该资源，或者缓存已过期，它会代表用户向**源站**发起请求，获取最新的资源。这个过程称为“**回源**”。
    *   边缘节点从源站获取到资源后，会将其**缓存**在自己本地，然后再返回给用户。这样，下一个访问该节点的附近用户就可以直接从缓存中受益。

### b. CDN 的价值

*   **加速**：核心价值。通过就近访问和智能路由，大幅缩短了数据传输的物理距离和网络延迟。
*   **高可用性**：CDN 的多节点架构提供了天然的冗余。即使某个节点出现故障，请求也可以被自动调度到其他健康的节点。
*   **分担源站压力**：绝大多数静态资源请求都由 CDN 的边缘节点处理，源站服务器只需应对少量的回源请求和动态内容请求，大大降低了负载。
*   **安全防护**：许多 CDN 服务商还提供 DDoS 攻击防护、WAF (Web Application Firewall) 等安全功能。

### c. 最佳实践

1.  **静态与动态资源分离**：
    *   将网站的资源分为两类：**静态资源**（如 CSS, JS, 图片, 字体）和**动态资源**（如 HTML, API 数据）。
    *   为静态资源单独配置一个域名（例如 `static.yourdomain.com`），并将其完全交由 CDN 进行缓存和分发。
    *   动态资源则由源站服务器处理，以保证内容的实时性。

2.  **合理配置缓存策略**：
    *   在源站服务器上，为静态资源设置**非常长**的 `Cache-Control: max-age`（例如一年 `max-age=31536000`）。
    *   这样可以最大化地利用 CDN 边缘节点缓存和浏览器本地缓存，最大限度地减少回源。

3.  **通过文件名进行版本控制**：
    *   由于静态资源的缓存时间设置得很长，当我们需要更新资源时（例如发布新版本的 JS 文件），不能直接覆盖同名文件。
    *   最佳实践是在文件名中加入**哈希值**或**版本号**，例如 `main.d2c4b8.js`。
    *   当文件内容改变时，文件名（哈希）也会改变。这样，浏览器在请求新的 HTML 时，就会请求一个全新的 URL，从而自然地绕开了旧版本的缓存，实现了无缝更新。现代化的构建工具（如 Webpack, Vite）都内置了此功能。

4.  **动静结合与 API 加速**：
    *   对于一些非高度个性化的动态内容（例如新闻列表 API），也可以利用 CDN 进行**短时间的缓存**（例如 1-5 分钟），这被称为“动态内容加速”，可以有效缓解突发流量下对源站 API 服务器的冲击。

5.  **选择合适的 CDN 服务商**：
    *   根据你的主要用户群体地理位置，选择在相应区域拥有丰富节点的服务商。
    *   评估其提供的功能，如 HTTP/3 支持、图片优化、安全防护等。

## 4. Fetch API 详解

Fetch API 是一个现代的、用于替代 `XMLHttpRequest` (XHR) 的网络请求接口。它基于 Promise，提供了更强大、更灵活、更简洁的 API。

### a. 基本用法

```javascript
fetch('https://api.example.com/data')
  .then(response => {
    // 检查响应是否成功
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // 将响应体解析为 JSON
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
```

### b. 核心概念：`Request`, `Response`, `Headers`

Fetch API 的强大之处在于其面向对象的设计，它将 HTTP 的各个部分抽象成了独立的对象。

*   **`Headers` 对象**：用于操作 HTTP 请求头和响应头。
    ```javascript
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Custom-Header', 'my-value');
    ```

*   **`Request` 对象**：代表一个资源请求。你可以用它来构建一个复杂的请求。
    ```javascript
    const request = new Request('/api/users', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ name: 'John Doe' })
    });
    ```

*   **`Response` 对象**：代表对一个请求的响应。`fetch()` 返回的 Promise 会 resolve 这个对象。
    *   `response.ok`: 布尔值，表示状态码是否在 200-299 范围内。
    *   `response.status`: 数字，HTTP 状态码。
    *   `response.headers`: `Headers` 对象。
    *   **处理响应体的方法** (这些方法都返回 Promise):
        *   `response.json()`: 解析为 JSON 对象。
        *   `response.text()`: 解析为字符串。
        *   `response.blob()`: 解析为 Blob 对象（用于处理文件/图片）。
        *   `response.arrayBuffer()`: 解析为 ArrayBuffer（用于处理二进制数据）。

### c. POST 请求

```javascript
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john.doe@example.com'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data));
```

### d. 中断请求：`AbortController`

这是 Fetch API 相较于 XHR 的一个巨大改进。

```javascript
// 1. 创建一个控制器
const controller = new AbortController();
const signal = controller.signal;

// 2. 将 signal 传递给 fetch
fetch('https://api.example.com/long-running-task', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Fetch error:', err);
    }
  });

// 3. 在需要的时候，调用 abort() 来中断请求
setTimeout(() => controller.abort(), 2000); // 2秒后中断请求
```

### e. Fetch vs XHR

| 特性         | `fetch`                                       | `XMLHttpRequest` (XHR)                         |
| ------------ | --------------------------------------------- | ---------------------------------------------- |
| **API 设计** | 基于 Promise，现代、简洁、链式调用            | 基于事件和回调，相对繁琐                       |
| **默认行为** | **不发送**跨域请求的 Cookie                     | **发送**跨域请求的 Cookie                      |
| **错误处理** | 只有在网络层面失败时才 reject Promise。对于 `404`, `500` 等 HTTP 错误，它会 resolve，需要通过 `response.ok` 来判断。 | 通过 `onerror` 和 `onreadystatechange` 来处理不同类型的错误。 |
| **请求中断** | 通过 `AbortController`，逻辑清晰                | 通过 `xhr.abort()`，状态管理相对复杂           |
| **功能**     | 支持流式处理响应体，更适合处理大数据          | 功能相对基础                                 |

## 5. 深入 Fetch：流式处理响应

在处理大型数据或实时数据流时，一次性将所有数据读入内存可能会导致应用卡顿甚至崩溃。`fetch` API 原生支持**流式处理（Streaming）**响应体，允许我们分块处理数据，这正是它的强大之处。

### a. 什么是流 (Stream)？

流是一种数据传输方式，它将数据分解成一个个小的数据块（chunks），然后按顺序传输。你可以把它想象成一条数据“管道”，数据从一端源源不断地流向另一端。

在 Fetch API 中，`response.body` 就是一个**可读流 (ReadableStream)** 对象。

### b. 为什么要使用流？

*   **降低内存占用**：无需将整个资源加载到内存中。对于一个 1GB 的视频文件，流式处理几乎不占用额外内存，而一次性加载则会直接耗尽内存。
*   **提升响应速度**：可以在数据完全到达之前，就开始处理已经收到的数据块。例如，可以实时解析一个巨大的 JSON 文件，或者在视频下载的同时进行播放。
*   **处理无限数据**：可以处理没有明确结束标记的实时数据流，如服务器推送的日志、股票行情等。

### c. 如何使用流处理响应？

`ReadableStream` 的核心是 `getReader()` 方法，它会返回一个“读取器”对象，通过这个读取器，我们可以异步地读取数据块。

**示例：实时处理服务器发送的文本数据**

假设服务器会每秒发送一段文本回来。

```javascript
fetch('/streaming-data')
  .then(response => {
    // 1. 获取可读流的读取器
    const reader = response.body.getReader();
    // 用于解码 Uint8Array 数据流
    const decoder = new TextDecoder();

    // 2. 定义一个递归函数来持续读取数据
    function readChunk() {
      return reader.read().then(({ done, value }) => {
        // 'done' 是一个布尔值，表示流是否已经结束
        // 'value' 是一个 Uint8Array 类型的数据块
        if (done) {
          console.log('Stream finished.');
          return;
        }

        // 解码数据块并处理
        const chunkText = decoder.decode(value);
        console.log('Received chunk:', chunkText);
        
        // 继续读取下一个数据块
        return readChunk();
      });
    }

    // 3. 开始读取
    return readChunk();
  })
  .catch(error => {
    console.error('Streaming error:', error);
  });
```

**示例：计算大文件的下载进度**

```javascript
fetch('/large-video.mp4')
  .then(response => {
    // 从 'Content-Length' 头部获取文件总大小
    const totalSize = Number(response.headers.get('Content-Length'));
    let loadedSize = 0;

    const reader = response.body.getReader();

    function readChunk() {
      return reader.read().then(({ done, value }) => {
        if (done) {
          console.log('Download finished.');
          return;
        }

        loadedSize += value.length;
        const progress = Math.round((loadedSize / totalSize) * 100);
        console.log(`Downloaded ${progress}%`);

        // 在这里，你还可以将数据块 (value) 传递给其他地方进行处理
        // process(value);

        return readChunk();
      });
    }

    return readChunk();
  });
```

### d. 现代语法：Async Iterators

对于现代浏览器，我们可以使用 `for await...of` 循环来更优雅地处理流，它极大地简化了代码。

```javascript
async function processStream() {
  try {
    const response = await fetch('/streaming-data');
    const decoder = new TextDecoder();

    // 使用 for await...of 循环来遍历流中的数据块
    for await (const chunk of response.body) {
      const chunkText = decoder.decode(chunk);
      console.log('Received chunk:', chunkText);
    }

    console.log('Stream finished.');
  } catch (error) {
    console.error('Streaming error:', error);
  }
}

processStream();
```

这种语法更具可读性，也更容易与 `async/await` 风格的代码集成，是未来处理流的首选方式。
