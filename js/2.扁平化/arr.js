// 1.1 使用 flat()
// const flatten = arr => arr.flat(Infinity);

// 1.2 递归实现
// function flatten(arr) {
//   let result = [];

//   for (const item of arr) {
//     if (Array.isArray(item)) {
//       result = result.concat(flatten(item));
//     } else {
//       result.push(item);
//     }
//   }

//   return result;
// }

// 1.3 迭代实现
function flatten(arr) {
  const needFlatten = arr.some(Array.isArray);
  if (!needFlatten) return arr;

  
  const stask = [...arr];
  const result = [];

  while (stask.length) {
    const item = stask.pop();
    if (Array.isArray(item)) {
      stask.push(...item);
    } else {
      result.unshift(item);
    }
  }

  return result;
}

const arr = [1, [2, [3, 4], 5], 6];

console.log(flatten(arr)); // [1, 2, 3, 4, 5, 6]
