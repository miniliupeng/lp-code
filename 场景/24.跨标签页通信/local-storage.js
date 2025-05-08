 // 在发送消息的标签页中
function sendMessage(message) {
  // 使用localStorage存储消息
  localStorage.setItem('tab-message', JSON.stringify({
    message: message,
    timestamp: Date.now()
  }));
}

// 在接收消息的标签页中
window.addEventListener('storage', (event) => {
  // 只处理我们关心的键
  if (event.key === 'tab-message') {
    const data = JSON.parse(event.newValue);
    console.log('收到消息:', data.message);
    // 这里可以进行其他处理
  }
});

// 使用示例
// sendMessage('你好，这是来自另一个标签页的消息');