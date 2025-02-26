// 模拟异步任务
function timeout(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

class SuperTask {
  constructor(maxCount = 2) {
    this.maxCount = maxCount; // 最大并发数
    this.queue = []; // 任务队列
    this.runCount = 0; // 当前并发数
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  run() {
    while (this.runCount < this.maxCount && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.runCount++;

      Promise.resolve(task())
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.runCount--;
          this.run();
        });
    }
  }
}

const superTask = new SuperTask();
function addTask(time, name) {
  superTask
    .add(() => timeout(time))
    .then(() => {
      console.log(`任务${name}完成`);
    });
}
addTask(10000, 1); // 10000ms后输出:任务1完成
addTask(5000, 2); //5000ms后输出:任务2完成
addTask(3000, 3); //8000ms后输出:任务3完成
addTask(4000, 4); //12000ms后输出:任务4完成
addTask(5000, 5); //15000ms后输出:任务5完成
