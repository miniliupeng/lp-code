// 手写实现数组的filter方法
Array.prototype.myFilter = function (callback) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      res.push(this[i]);
    }
  }
  return res;
};

// 测试
const arr = [1, 2, 3, 4, 5, 6];
console.log('原数组:', arr);
console.log('筛选偶数:', arr.myFilter(x => x % 2 === 0)); // [2, 4, 6]
console.log('筛选大于3:', arr.myFilter(x => x > 3)); // [4, 5, 6]
console.log('带索引筛选:', arr.myFilter((v, i) => i > 2)); // [4, 5, 6]

// 对比原生方法
console.log('原生filter:', arr.filter(x => x % 2 === 1));
console.log('自定义filter:', arr.myFilter(x => x % 2 === 1));
