Function.prototype.myCall = function(context, ...args) {
  // 如果传入的上下文为 null 或 undefined，则默认为全局对象
  context = context || window;
  // 将当前函数作为上下文对象的一个属性
  context.fn = this;
  // 执行函数，并将传入的参数作为参数
  const result = context.fn(...args);
  // 删除上下文对象的 fn 属性
  delete context.fn;
  // 返回函数执行结果
  return result;
};

