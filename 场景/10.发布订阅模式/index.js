class EventEmitter {
  constructor() {
    // 存储事件和处理函数的容器
    this.events = new Map();
  }

  /**
   * 订阅事件
   * @param {string} eventName - 事件名称
   * @param {Function} handler - 事件处理函数
   * @returns {Function} - 取消订阅的函数
   */
  subscribe(eventName, handler) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const handlers = this.events.get(eventName);
    handlers.push(handler);

    // 返回取消订阅函数
    return () => {
      this.unsubscribe(eventName, handler);
    };
  }

  /**
   * 取消订阅
   * @param {string} eventName - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  unsubscribe(eventName, handler) {
    if (!this.events.has(eventName)) return;

    const handlers = this.events.get(eventName);
    const index = handlers.indexOf(handler);
    
    if (index !== -1) {
      handlers.splice(index, 1);
    }

    // 如果没有处理函数了，删除该事件
    if (handlers.length === 0) {
      this.events.delete(eventName);
    }
  }

  /**
   * 发布事件
   * @param {string} eventName - 事件名称
   * @param {...any} args - 传递给处理函数的参数
   */
  publish(eventName, ...args) {
    if (!this.events.has(eventName)) return;

    const handlers = this.events.get(eventName);
    handlers.forEach(handler => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`事件处理器执行错误: ${error}`);
      }
    });
  }

  /**
   * 只订阅一次
   * @param {string} eventName - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  once(eventName, handler) {
    const wrapper = (...args) => {
      handler(...args);
      this.unsubscribe(eventName, wrapper);
    };
    this.subscribe(eventName, wrapper);
  }

  /**
   * 清除订阅
   * @param {string} [eventName] - 可选，指定要清除的事件名称
   */
  clear(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
}

// 使用示例
const eventBus = new EventEmitter();

// 示例1：基础订阅和发布
const handler1 = (data) => {
  console.log('收到消息1：', data);
};

const unsubscribe = eventBus.subscribe('message', handler1);

eventBus.publish('message', { text: '你好！' });
// 输出: 收到消息1： { text: '你好！' }

// 取消订阅
unsubscribe();

// 示例2：一次性订阅
eventBus.once('notification', (message) => {
  console.log('一次性通知：', message);
});

eventBus.publish('notification', '这是一条测试通知');
// 输出: 一次性通知： 这是一条测试通知

eventBus.publish('notification', '这条通知不会被收到');
// 没有输出，因为处理器已经被移除

// 示例3：多个处理器
eventBus.subscribe('userAction', (action) => {
  console.log('处理器1收到动作：', action);
});

eventBus.subscribe('userAction', (action) => {
  console.log('处理器2收到动作：', action);
});

eventBus.publish('userAction', '点击按钮');
// 输出:
// 处理器1收到动作： 点击按钮
// 处理器2收到动作： 点击按钮





class EventEmitter2 {
  constructor() {
    this.events = new Map()
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, [])
    }
    this.events.get(eventName).push(callback)
  }
  
  emit(eventName, ...args) {
    if (!this.events.has(eventName)) return;
    this.events.get(eventName).forEach(callback => {
      callback(...args)
    })
  }

  off(eventName, callback) {
    if (!this.events.has(eventName)) return;
    this.events.get(eventName) = this.events.get(eventName).filter(cb => cb !== callback)
  }

  once(eventName, callback) {
    const fn = (...args) => {
      callback(...args)
      this.off(eventName, fn)
    }
    this.on(eventName, fn)
  }

  clear(eventName) {
    this.events.delete(eventName)
  }
}