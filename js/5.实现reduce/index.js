// 基础版本
Array.prototype.myReduce = function(callback, initialValue) {
  // 检查数组是否为空
  if (this.length === 0 && initialValue === undefined) {
    throw new TypeError('Reduce of empty array with no initial value');
  }
  
  let accumulator = initialValue;
  let startIndex = 0;
  
  // 如果没有提供初始值，使用数组第一个元素作为初始值
  if (accumulator === undefined) {
    accumulator = this[0];
    startIndex = 1;
  }
  
  // 遍历数组
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  
  return accumulator;
};

// 测试
const arr = [1, 2, 3, 4, 5];
const sum = arr.myReduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15