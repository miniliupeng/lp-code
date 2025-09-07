function myNew(constructor, ...args) {
  // 如果不是一个函数，就报错
  if (typeof constructor !== "function") {
    throw "myNew function the first param must be a function";
  }
  // 基于原型链 创建一个新对象，继承构造函数constructor的原型对象上的属性
  let newObj = Object.create(constructor.prototype);
  // 将newObj作为this，执行 constructor ，传入参数
  let res = constructor.apply(newObj, args);
  // 判断函数的执行结果是否是对象，typeof null 也是'object'所以要排除null
  let isObject = typeof res === "object" && res !== null;
  // 判断函数的执行结果是否是函数
  let isFunction = typeof res === "function";
  // 如果函数的执行结果是一个对象或函数, 则返回执行的结果, 否则, 返回新创建的对象
  return isObject || isFunction ? res : newObj;
}

