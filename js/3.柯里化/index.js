// 基础柯里化函数
function curry(fn) {
  return function curried(...args) {
    // 如果提供的参数数量足够
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // 否则返回一个新函数，等待更多参数
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

// 使用示例
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6