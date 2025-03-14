// 让 let [a,b] = {a:1,b:2}  成立

const obj = {
  a: 1,
  b: 2,
  // [Symbol.iterator]() {
  //   const values = [this.a, this.b];  // 获取对象中的实际值
  //   let index = 0;
  //   return {
  //     next() {
  //       return {
  //         value: values[index++],      // 返回数组中的值
  //         done: index > values.length  // 当索引超过数组长度时完成迭代
  //       }
  //     }
  //   }
  // }

  // [Symbol.iterator]() {
  //   return Object.values(this)[Symbol.iterator]();
  // }

  *[Symbol.iterator]() {
    yield this.a;
    yield this.b;
  }
}

let [a, b] = obj

console.log(a, b);
