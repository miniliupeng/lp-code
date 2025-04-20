Function.prototype.bind = function (that, ...argv) {
  if (typeof this !== 'function') {
    throw new TypeError(`${this} is not callable`);
  }
  // 保存原函数
  let self = this;
  // 获取bind后函数传入的参数
  return function (...argu) {
    return self.apply(that, [...argv, ...argu]);
  };
};

let obj = {
  ll: 'seve'
};
let func1 = function (a, b, c) {
  console.log(this.ll);
  console.log([a, b, c]);
}.bind(obj, 1, 2);

func1(3); // seve
// [ 1, 2, 3 ]
