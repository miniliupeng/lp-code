var rAF = function (loop) {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  )(loop);
};

var fps = 0;
var frame = 0;
var lastTime = Date.now();
var lastFrameTime = Date.now();

var loop = function () {
  var now = Date.now();

  lastFrameTime = now;
  frame++;

  if (now - lastTime > 1000) {
    fps = Math.round((frame * 1000) / (now - lastTime));
    console.log('fps', fps); // 每秒 FPS
    frame = 0;
    lastTime = now;
  }

  rAF(loop);
};

loop()
