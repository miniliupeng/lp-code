// function isSubset(arr1, arr2) {
//   return arr2.every((item) => arr1.includes(item));
// }

function isSubsetWithLengthCheck(arr1, arr2) {
  // 长度检查
  if (arr2.length > arr1.length) return false;
  
  const set = new Set(arr1);
  return arr2.every(item => set.has(item));
}

console.log(isSubsetWithLengthCheck([1, 2, 3, 4, 5], [1, 2, 3]));


