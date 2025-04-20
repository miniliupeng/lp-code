/**
 * 串行执行Promise任务，失败时重试指定次数
 * @param {Array<Function>} tasks - 任务数组，每个任务是返回Promise的函数
 * @param {number} retryCount - 每个任务失败后的最大重试次数
 * @returns {Promise<Array>} - 所有任务的执行结果数组
 */
function executeTasksWithRetry(tasks, retryCount = 3) {
  const results = [];

  return tasks.reduce((promise, task, index) => {
    return promise.then(() => {
      console.log(`开始执行任务${index + 1}...`);
      // 包装任务执行和重试逻辑
      return executeWithRetry(task, retryCount, index)
        .then(result => {
          console.log(`任务${index + 1}执行成功:`, result);
          results.push(result);
          return results;
        });
    });
  }, Promise.resolve());

  /**
   * 执行单个任务并在失败时重试
   * @param {Function} task - 返回Promise的任务函数
   * @param {number} maxRetries - 最大重试次数
   * @param {number} taskIndex - 任务索引（用于日志）
   * @returns {Promise} - 任务执行的Promise
   */
  function executeWithRetry(task, maxRetries, taskIndex, currentRetry = 0) {
    return task().catch(error => {
      // 当前重试次数小于最大重试次数时继续重试
      if (currentRetry < maxRetries) {
        console.log(`任务${taskIndex + 1}失败，正在进行第${currentRetry + 1}次重试...`);
        // 递归调用，重试次数+1
        return executeWithRetry(task, maxRetries, taskIndex, currentRetry + 1);
      }
      
      // 超过最大重试次数，抛出错误终止整个序列
      console.error(`任务${taskIndex + 1}已重试${maxRetries}次仍然失败:`, error);
      throw error;
    });
  }
}

// 使用示例
const tasks = [
  () => new Promise((resolve, reject) => setTimeout(resolve, 1000, '任务1完成')),
  () => new Promise((resolve, reject) => setTimeout(reject, 1000, '任务2失败')),
  () => new Promise((resolve, reject) => setTimeout(resolve, 1000, '任务3完成'))
];

executeTasksWithRetry(tasks, 2)
  .then(results => {
    console.log('所有任务执行成功:', results);
  })
  .catch(error => {
    console.error('任务序列执行失败:', error);
  });