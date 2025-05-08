 // 创建一个广播频道
const channel = new BroadcastChannel('tab-communication');

// 在发送消息的标签页中
function sendMessage(message) {
  channel.postMessage({
    message: message,
    timestamp: Date.now()
  });
}

// 在接收消息的标签页中
channel.onmessage = (event) => {
  console.log('收到消息:', event.data.message);
  // 这里可以进行其他处理
};

// 不再需要时关闭连接
function closeChannel() {
  channel.close();
}

// 使用示例
// sendMessage('你好，这是通过BroadcastChannel发送的消息');