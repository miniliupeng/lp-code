// class TaskController {
//   constructor(options = {}) {}

//   addTask(task, options = {}) {}

//   _executeTask(taskInfo) {}

//   _runTasks() {}

//   pause() {}

//   resume() {}

//   clear() {}

//   getStatus() {}
// }

class TaskController {
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 2;
    this.timeout = options.timeout || 0;
    this.retryCount = options.retryCount || 2;
    this.retryInterval = options.retryInterval || 1000;

    this.queue = [];
    this.running = new Set();
    this.results = new Map();
    this.status = 'idle';
  }

  addTask(task, options = {}) {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    return new Promise((resolve, reject) => {
      const taskInfo = {
        id: taskId,
        task,
        options: {
          priority: options.priority || 0,
          timeout: options.timeout || this.timeout,
          retryCount: options.retryCount ?? this.retryCount,
          ...options
        },
        resolve,
        reject,
        addedTime: Date.now()
      };

      this.queue.push(taskInfo);
      this.queue.sort((a, b) => b.options.priority - a.options.priority);

      this._runTasks();
    });
  }

  async _executeTask(taskInfo) {

    const { task, options } = taskInfo;
    let attempts = 0;
    while (attempts <= options.retryCount) {
      try {
        const timeoutPromise = options.timeout
          ? Promise.race([
              task(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout!')), options.timeout))
            ])
          : task();

        return await timeoutPromise;
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

  async _runTasks() {
    if (this.status === 'paused') return;
    while (this.queue.length > 0 && this.running.size < this.maxConcurrent) {
      this.status = 'pending';
      const taskInfo = this.queue.shift();
      this.running.add(taskInfo.id);

      this._executeTask(taskInfo)
        .then((result) => {
   
          
          this.results.set(taskInfo.id, {
            status: 'compelete',
            result,
            completedTime: Date.now()
          });
          console.log(this.results);
          this.running.delete(taskInfo.id);

          if (this.queue.length === 0 && this.running.size === 0) {
            this.status = 'idle';
          }
          taskInfo.resolve(result);
          this._runTasks();
        })
        .catch((error) => {
          this.results.set(taskInfo.id, {
            status: 'failed',
            error,
            completedTime: Date.now()
          });
          this.running.delete(taskInfo.id);

          if (this.queue.length === 0 && this.running.size === 0) {
            this.status = 'idle';
          }
          taskInfo.reject(result);
          this._runTasks();
        });
    }
  }

  pause() {
    this.status = 'paused';
  }

  resume() {
    if (this.status === 'paused') {
      this.status = 'idle';
      this._runTasks();
    }
  }

  clear() {
    this.queue = [];
  }

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
