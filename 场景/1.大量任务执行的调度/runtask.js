/**
 * 运行一个耗时任务
 * 如果要异步执行任务,请返回Promise
 * 要尽快完成任务,同时不要让页面产生卡顿
 * 尽量兼容更多的浏览器
 * @param {Function} task
 */
function runTask(task) {
  // 同步任务
  // task();

  // 微任务
  // return Promise.resolve().then(() => task());

  // 宏任务
  // return new Promise((resolve) =>
  //   setTimeout(() => {
  //     task();
  //     resolve();
  //   }, 0)
  // );

  return new Promise((resolve) => {
    _run(task, resolve);
  });
}

function _run(task, callback) {
  // requestIdleCallback 兼容性不好
  // requestIdleCallback((deadline) => {
  //   if (deadline.timeRemaining() > 0) {
  //     task();
  //     callback();
  //   } else {
  //     _run(task, callback);
  //   }
  // });

  // requestAnimationFrame 兼容性好
  const start = performance.now();
  requestAnimationFrame(() => {
    if (performance.now() - start < 16.6) {
      task();
      callback();
    } else {
      _run(task, callback);
    }
  });
}

// 思考
// 浏览器渲染过程
// 1. 执行一个宏任务（MacroTask）
// 2. 清空微任务队列（MicroTask Queue）
// 3. 执行 requestAnimationFrame
// 4. 渲染时机是否到达？ 渲染
// 5. 重复以上步骤，执行下一个宏任务

// 结论：
// 同步任务 会卡死
// 微任务 会卡死
// 宏任务 chrome 会降低动画帧数，safari 会卡死
