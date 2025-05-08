 // 在标签页A中打开标签页B
const tabB = window.open('http://同域地址/页面B', '_blank');

// 在标签页A中发送消息
function sendMessageToTabB(message) {
  if (tabB && !tabB.closed) {
    tabB.postMessage({
      message: message,
      timestamp: Date.now()
    }, 'http://同域地址');
  }
}

// 在标签页B中接收消息
window.addEventListener('message', event => {
  // 验证发送者源
  if (event.origin === 'http://同域地址') {
    console.log('收到消息:', event.data.message);
    // 可以回复消息
    event.source.postMessage({
      message: '已收到你的消息',
      timestamp: Date.now()
    }, event.origin);
  }
});

// 使用示例
// sendMessageToTabB('你好，这是从标签页A发送的消息');