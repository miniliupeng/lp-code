// setInterval 版本

// function example1(count) {
//   // let count = 10;
//   const timer = setInterval(() => {
//     console.log(count);
//     count--;
//     if (count < 0) {
//       clearInterval(timer);
//       console.log("倒计时结束");
//     }
//   }, 1000);
// }

// example1(10);

// MDN说明：如果你的代码逻辑执行时间可能比定时器时间间隔要长，建议你使用递归调用了 setTimeout() 的具名函数。
// js 因为是单线程的原因，如果前面有阻塞线程的任务，那么就可能会导致 setInterval 函数延迟，这样倒计时就肯定会不准确，建议使用 setTimeout 替换 setInterval
// setTimeout 版本

// function example2(count) {
//   setTimeout(() => {
//     console.log(count);
//     count--;
//     if (count < 0) {
//       console.log("倒计时结束");
//     } else {
//       example2(count);
//     }

//   }, 1000);
// }

// example2(10);

// MDN:有很多因素会导致 setTimeout 的回调函数执行比设定的预期值更久，比如嵌套超时、非活动标签超时、追踪型脚本的节流、超时延迟

// requestAnimationFrame 版本 见 requestAnimationFrame.html
// 允许以 60 帧/秒 (FPS) 的速率请求回调，而不会阻塞主线程。通过调用 requestAnimationFrame 方法浏览器会在下一次重绘之前执行指定的函数，这样可以确保回调在每一帧之间都能够得到适时的更新



// web worker 版本 见 worker.html
