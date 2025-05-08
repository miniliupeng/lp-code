 // 首先需要注册 Service Worker

// sw.js 文件内容
/*
self.addEventListener('message', event => {
  // 获取所有已打开的窗口客户端
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      // 不要发送给自己
      if (client.id !== event.source.id) {
        client.postMessage({
          message: event.data.message,
          sender: event.source.id,
          timestamp: event.data.timestamp
        });
      }
    });
  });
});
*/

// 在页面中注册和使用 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker 注册成功:', registration.scope);
    })
    .catch(error => {
      console.log('Service Worker 注册失败:', error);
    });
}

// 发送消息
function sendMessage(message) {
  navigator.serviceWorker.controller.postMessage({
    message: message,
    timestamp: Date.now()
  });
}

// 接收消息
navigator.serviceWorker.addEventListener('message', event => {
  console.log('收到消息:', event.data.message);
  // 这里可以进行其他处理
});

// 使用示例
// sendMessage('这是通过 Service Worker 发送的消息');