 // 首先创建一个worker文件: worker.js
/*
// worker.js 内容
const connections = [];

self.onconnect = function(e) {
  const port = e.ports[0];
  connections.push(port);
  
  port.onmessage = function(e) {
    // 收到消息后，广播给所有连接的端口（除了发送消息的端口）
    connections.forEach(function(connection) {
      if (connection !== port) {
        connection.postMessage(e.data);
      }
    });
  };
  
  port.start();
};
*/

// 在各个标签页中使用 SharedWorker
// 注意：需要在服务器环境下运行
const worker = new SharedWorker('worker.js');

// 发送消息
function sendMessage(message) {
  worker.port.postMessage({
    message: message,
    timestamp: Date.now()
  });
}

// 接收消息
worker.port.onmessage = function(e) {
  console.log('收到消息:', e.data.message);
  // 这里可以进行其他处理
};

// 启动通信
worker.port.start();

// 使用示例
// sendMessage('这是通过 SharedWorker 发送的消息');