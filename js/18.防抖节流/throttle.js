function throttle(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}


function throttle2(fn, delay = 500) {
  let prev = Date.now()
  return function (...args) {
    let now = Date.now()
    if (now - prev >= delay) {
      fn.apply(this, args)
      prev = Date.now()
    }
  }
}