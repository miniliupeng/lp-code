/**
 * 依次顺序执行一系列任务
 * 所有任务全部完成后可以得到每个任务的执行结果
 * 需要返回两个方法,start用于启动任务,pause用于暂停任务
 * 每个任务具有原子性,即不可中断,只能在两个任务之间中断
 * @param{...Function}tasks任务列表,每个任务无等、异步
 */
function processTasks(...tasks) {
  let isRunning = false;
  let currentTaskIndex = 0;
  let result = [];

  return {
    start() {
      return new Promise(async (resolve) => {
        if (isRunning) return;
        isRunning = true;

        while (currentTaskIndex < tasks.length) {
          const task = tasks[currentTaskIndex];
          const res = await task();
          result.push(res);
          currentTaskIndex++;
          if (!isRunning) return;
        }
        isRunning = false;
        resolve(result);
      });
    },
    pause() {
      isRunning = false;
    }
  };
}
