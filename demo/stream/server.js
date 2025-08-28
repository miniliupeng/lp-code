const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// --- 导航和静态文件路由 ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/sse', (req, res) => {
  res.sendFile(path.join(__dirname, 'sse.html'));
});

app.get('/fetch', (req, res) => {
  res.sendFile(path.join(__dirname, 'fetch.html'));
});

app.get('/markdown', (req, res) => {
  res.sendFile(path.join(__dirname, 'markdown.html'));
});

app.get('/markdown-safe', (req, res) => {
  res.sendFile(path.join(__dirname, 'markdown-safe.html'));
});


// --- SSE 流式路由 ---
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // 立即发送头部

  const message = "这是一个来自服务器的打字机效果演示 (SSE)... 当消息显示完毕后，连接将自动断开。";
  let charIndex = 0;

  const intervalId = setInterval(() => {
    if (charIndex < message.length) {
      const char = message[charIndex++];
      res.write(`data: ${JSON.stringify({ char })}\n\n`);
    } else {
      clearInterval(intervalId);
      res.write(`event: end\ndata: {}\n\n`);
      res.end();
    }
  }, 100);

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
    console.log('SSE 客户端关闭连接');
  });
});

// --- Fetch API 流式路由 ---
app.get('/fetch-stream', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const message = "这是一个来自服务器的打字机效果演示 (Fetch API)... 使用ReadableStream实现流式传输。";
  let charIndex = 0;

  const intervalId = setInterval(() => {
    if (charIndex < message.length) {
      const char = message[charIndex++];
      res.write(JSON.stringify({ char, done: false }) + '\n');
    } else {
      clearInterval(intervalId);
      res.write(JSON.stringify({ char: '', done: true }) + '\n');
      res.end();
    }
  }, 100);

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
    console.log('Fetch 客户端关闭连接');
  });
});

// --- Markdown 流式渲染路由 ---
app.get('/markdown-stream', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // 示例Markdown内容 (包含XSS攻击演示)
  const markdownContent = `# 🚀 前端流式传输技术详解 - XSS安全演示

> 这是一个**实时渲染**的Markdown文档示例，同时演示XSS攻击风险。

## ⚠️ XSS攻击演示

下面是几种常见的XSS攻击方式：

### 1. 基础脚本注入
<script>alert('XSS攻击成功！这是一个安全漏洞演示')</script>

### 2. 图片标签事件注入
<img src="x" onerror="alert('通过img标签的onerror事件执行XSS')">

### 3. 内联事件处理器
<div onclick="alert('点击事件XSS')">点击这里触发XSS</div>

### 4. JavaScript协议
<a href="javascript:alert('JavaScript协议XSS')">点击链接触发XSS</a>

### 5. 表单劫持
<form><input type="text" value="" onfocus="alert('表单焦点XSS')"></form>

## 📖 什么是流式传输？

流式传输是一种**数据传输技术**，允许数据在传输过程中逐步处理，而不需要等待完整数据包到达。

### 核心优势

1. **实时性** - 数据到达即可处理
2. **内存效率** - 不需要缓存完整数据
3. **用户体验** - 减少等待时间

## 💻 技术实现

### JavaScript实现代码

\`\`\`javascript
// Fetch API 流式读取
const response = await fetch('/stream');
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  processChunk(chunk);
}
\`\`\`

### Node.js服务端代码

\`\`\`javascript
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.flushHeaders();
  
  // 分块发送数据
  res.write(JSON.stringify({ chunk: 'Hello' }) + '\\n');
  res.write(JSON.stringify({ chunk: ' World!' }) + '\\n');
  res.end();
});
\`\`\`

## 🎯 应用场景

### 实时场景
- **聊天应用** - 消息实时显示
- **代码编辑器** - 实时语法高亮
- **日志查看** - 实时日志流

### 数据处理
- **大文件上传** - 进度实时反馈  
- **数据分析** - 实时结果展示
- **AI对话** - 逐字输出效果

## 📊 性能对比

| 传输方式 | 首字节时间 | 内存占用 | 用户体验 |
|---------|-----------|---------|---------|
| 传统请求 | 高 | 高 | 等待时间长 |
| 流式传输 | **低** | **低** | **实时响应** |

## 🔧 最佳实践

1. **错误处理** - 实现重连机制
2. **数据缓冲** - 处理分块数据
3. **性能优化** - 控制传输频率

### 注意事项

> ⚠️ **重要提示**: 流式传输需要考虑网络稳定性和错误恢复机制。

---

*本示例展示了 Fetch API + Markdown + 代码高亮的完整实现方案* ✨`;

  // 按行分割发送，保持Markdown语法完整性
  const lines = markdownContent.split('\n');
  let lineIndex = 0;

  console.log(`开始发送Markdown内容，共 ${lines.length} 行`);

  const intervalId = setInterval(() => {
    if (lineIndex < lines.length) {
      const line = lines[lineIndex++] + '\n'; // 保留换行符
      res.write(JSON.stringify({ chunk: line, done: false }) + '\n');
      console.log(`发送Markdown行 ${lineIndex}/${lines.length}`);
    } else {
      clearInterval(intervalId);
      res.write(JSON.stringify({ chunk: '', done: true }) + '\n');
      console.log('Markdown发送完成');
      res.end();
    }
  }, 200); // 稍微慢一点，让渲染效果更明显

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
    console.log('Markdown客户端关闭连接');
  });
});

app.listen(port, () => {
  console.log(`统一示例服务器正在 http://localhost:${port} 运行`);
});
