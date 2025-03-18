// function uniqueArray(arr){
//   // 将数组转换为Set去除元素
//   const uniqueSet = new Set(arr);
//   // 再将Set转换会数组
//   return Array.from(uniqueSet);
// }
// // 测试
// const testArr1 = [1, 2, 2, 3, 4, 4];
// console.log(uniqueArray(testArr1));

function uniqueArray(arr) {
  return arr.filter((item, index) => {
    // 检查元素首次出现的位置是否和当前索引相同
    return arr.indexOf(item) === index;
  });
}

// 测试
const testArr4 = [1, 2, 2, 3, 4, 4];
console.log(uniqueArray(testArr4));
