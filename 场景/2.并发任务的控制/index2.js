class TaskController {
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 2; // 最大并发数
    this.timeout = options.timeout || 0; // 任务超时时间
    this.retryCount = options.retryCount || 0; // 重试次数
    this.retryInterval = options.retryInterval || 1000; // 重试间隔

    this.queue = []; // 任务队列
    this.running = new Set(); // 正在执行的任务集合
    this.results = new Map(); // 任务结果映射
    this.status = 'idle'; // 状态：idle, running, paused
  }

  /**
   * 添加任务
   * @param {Function} task - 任务函数
   * @param {Object} options - 任务配置
   * @returns {Promise}
   */
  addTask(task, options = {}) {
    const taskId = options.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return new Promise((resolve, reject) => {
      const taskInfo = {
        id: taskId,
        task,
        options: {
          ...options,
          priority: options.priority || 0,
          timeout: options.timeout || this.timeout,
          retryCount: options.retryCount ?? this.retryCount
        },
        resolve,
        reject,
        addedTime: Date.now()
      };

      this.queue.push(taskInfo);
      this.queue.sort((a, b) => b.options.priority - a.options.priority); // 优先级排序

      this._runTasks();
    });
  }

  /**
   * 执行单个任务
   * @param {Object} taskInfo - 任务信息
   * @returns {Promise}
   */
  async _executeTask(taskInfo) {
    const { task, options } = taskInfo;
    let attempts = 0;

    while (attempts <= options.retryCount) {
      try {
        const timeoutPromise = options.timeout
          ? Promise.race([
              task(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Task timeout')), options.timeout))
            ])
          : task();

        const result = await timeoutPromise;
        return result;
      } catch (error) {
        attempts++;
        if (attempts <= options.retryCount) {
          await new Promise((resolve) => setTimeout(resolve, this.retryInterval));
          continue;
        }
        throw error;
      }
    }
  }

  /**
   * 运行任务队列
   */
  async _runTasks() {
    if (this.status === 'paused') return;

    while (this.queue.length > 0 && this.running.size < this.maxConcurrent) {
      this.status = 'running';
      const taskInfo = this.queue.shift();
      this.running.add(taskInfo.id);

      this._executeTask(taskInfo)
        .then((result) => {
          // 1. 先更新任务结果
          this.results.set(taskInfo.id, {
            status: 'completed',
            result,
            completedTime: Date.now()
          });
          // 2. 更新运行状态
          this.running.delete(taskInfo.id);
          // 3. 检查是否所有任务都完成
          if (this.queue.length === 0 && this.running.size === 0) {
            this.status = 'idle';
          }
          // 4. 解决 Promise
          taskInfo.resolve(result);
          // 5. 继续执行队列
          this._runTasks();
        })
        .catch((error) => {
          // 同样的顺序处理错误情况
          this.results.set(taskInfo.id, {
            status: 'failed',
            error,
            completedTime: Date.now()
          });
          this.running.delete(taskInfo.id);
          if (this.queue.length === 0 && this.running.size === 0) {
            this.status = 'idle';
          }
          taskInfo.reject(error);
          this._runTasks();
        });
    }
  }

  /**
   * 暂停任务执行
   */
  pause() {
    this.status = 'paused';
  }

  /**
   * 恢复任务执行
   */
  resume() {
    if (this.status === 'paused') {
      this.status = 'idle';
      this._runTasks();
    }
  }

  /**
   * 清空任务队列
   */
  clear() {
    this.queue = [];
  }

  /**
   * 获取任务状态
   */
  getStatus() {
    return {
      status: this.status,
      queueLength: this.queue.length,
      runningTasks: Array.from(this.running),
      completedTasks: Array.from(this.results.entries()).map(([id, info]) => ({
        id,
        ...info
      }))
    };
  }
}

// 使用示例
const controller = new TaskController({
  maxConcurrent: 2,
  timeout: 5000,
  retryCount: 2,
  retryInterval: 1000
});

// 模拟异步任务
const createTask = (time, name) => () => new Promise((resolve) => setTimeout(() => resolve(`任务${name}完成`), time));

// 添加任务示例
async function demo() {
  try {
    const task1 = controller.addTask(createTask(3000, 1), { priority: 2 });
    const task2 = controller.addTask(createTask(2000, 2), { priority: 1 });
    const task3 = controller.addTask(createTask(1000, 3), { priority: 0 });

    console.log('Tasks added');

    const results = await Promise.all([task1, task2, task3]);
    console.log('All tasks completed:', results);
    console.log('Final status:', controller.getStatus());
  } catch (error) {
    console.error('Error:', error);
  }
}

demo();
