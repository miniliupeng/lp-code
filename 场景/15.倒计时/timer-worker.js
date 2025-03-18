// timer-worker.js
self.onmessage = function (e) {
  if (e.data.command === 'start') {
    const interval = e.data.interval;
    const duration = e.data.duration;
    const startTime = Date.now();
    const endTime = startTime + duration;

    function tick() {
      const now = Date.now();
      if (now < endTime) {
        self.postMessage({
          remaining: endTime - now,
          elapsed: now - startTime
        });
        setTimeout(tick, interval);
      } else {
        self.postMessage({
          remaining: 0,
          elapsed: duration,
          done: true
        });
      }
    }

    tick();
  }
};
