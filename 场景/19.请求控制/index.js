class RequestController {
  constructor(limit = 10, interval = 5000) {
    this.limit = limit;          // 5秒内最大请求数
    this.interval = interval;    // 时间窗口(ms)
    this.queue = [];            // 请求队列
    this.running = 0;           // 当前正在执行的请求数
    this.lastReset = Date.now(); // 上次重置时间
  }

  async request(fn) {
    // 检查是否需要重置计数器
    const now = Date.now();
    if (now - this.lastReset >= this.interval) {
      this.running = 0;
      this.lastReset = now;
    }

    // 如果当前运行的请求数达到限制，加入队列等待
    if (this.running >= this.limit) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    try {
      this.running++;
      const result = await fn();
      return result;
    } finally {
      this.running--;
      // 如果队列中有等待的请求，执行下一个
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next();
      }
    }
  }
}

// 使用示例
async function example() {
  const controller = new RequestController();
  
  // 模拟 API 请求
  const mockRequest = async (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`请求 ${id} 完成`);
        resolve(`结果 ${id}`);
      }, 1000);
    });
  };

  // 并发执行20个请求
  const requests = Array(20).fill().map((_, i) => 
    controller.request(() => mockRequest(i))
  );

  const results = await Promise.all(requests);
  console.log('所有请求完成:', results);
}

// 运行示例
example();