var rAF = function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
}();

var fps = 0;
var frame = 0;
var lastTime = Date.now();

var loop = function () {
  var now = Date.now();
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
