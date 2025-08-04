// 手写实现数组的map方法
Array.prototype.myMap = function (callback) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(callback(this[i], i, this));
  }
  return res;
};

// 测试
const arr = [1, 2, 3, 4];
console.log('原数组:', arr);
console.log('乘以2:', arr.myMap(x => x * 2)); // [2, 4, 6, 8]
console.log('带索引:', arr.myMap((v, i) => `${v}-${i}`)); // ['1-0', '2-1', '3-2', '4-3']

// 对比原生方法
console.log('原生map:', arr.map(x => x * x));
console.log('自定义map:', arr.myMap(x => x * x));
