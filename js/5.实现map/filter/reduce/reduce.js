// 手写实现数组的reduce方法
Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;
  
  // 如果没有初始值，使用数组第一个元素作为初始值
  if (initialValue === undefined) {
    accumulator = this[0];
    startIndex = 1;
  }
  
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  
  return accumulator;
};

// 测试
const arr = [1, 2, 3, 4, 5];
console.log('原数组:', arr);

// 测试求和（有初始值）
console.log('求和（初始值0）:', arr.myReduce((acc, cur) => acc + cur, 0)); // 15

// 测试求和（无初始值）
console.log('求和（无初始值）:', arr.myReduce((acc, cur) => acc + cur)); // 15

// 测试求最大值
console.log('求最大值:', arr.myReduce((acc, cur) => Math.max(acc, cur))); // 5

// 测试累积字符串
console.log('累积字符串:', arr.myReduce((acc, cur, index) => `${acc}-${cur}(${index})`, 'start')); 

// 对比原生方法
console.log('原生reduce:', arr.reduce((acc, cur) => acc * cur, 1));
console.log('自定义reduce:', arr.myReduce((acc, cur) => acc * cur, 1));
