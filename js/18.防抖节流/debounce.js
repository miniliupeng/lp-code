/**
 * @desc 函数防抖
 * @param {Function} func 要防抖的函数
 * @param {number} delay 延迟时间，单位毫秒
 * @return {Function} 返回一个包装后的函数
 */
function debounce(func, delay = 500) {
  let timer = null;
  
  return function (...args) {
    // 如果 timer 存在，说明之前已经设置过计时器，需要清除掉
    if (timer) {
      clearTimeout(timer);
    }
    
    // 重新设置一个新的计时器
    timer = setTimeout(() => {
      // 当计时器触发时，执行真正的函数
      func.apply(this, args);
      // 执行完毕后，可以将 timer 清空 (可选)
      timer = null;
    }, delay);
  };
}
