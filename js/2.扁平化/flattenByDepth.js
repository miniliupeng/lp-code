// 实现 flattenByDepth 函数
// 按照指定的深度展开嵌套数组

function flattenByDepth(arr, depth = 1) {
  // 处理边界情况
  if (depth <= 0) return [...arr];
  
  const result = [];
  
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    
    if (Array.isArray(item) && depth > 0) {
      // 递归展开，深度减1
      result.push(...flattenByDepth(item, depth - 1));
    } else {
      // 不是数组或已达到展开深度，直接添加
      result.push(item);
    }
  }
  
  return result;
}

// 测试用例
const testArr = [1, [2, 3], [4, [5, 6]], [7, [8, [9, 10]]]];

console.log('原数组:', testArr);
console.log('深度0:', flattenByDepth(testArr, 0)); // [1, [2, 3], [4, [5, 6]], [7, [8, [9, 10]]]]
console.log('深度1:', flattenByDepth(testArr, 1)); // [1, 2, 3, 4, [5, 6], 7, [8, [9, 10]]]
console.log('深度2:', flattenByDepth(testArr, 2)); // [1, 2, 3, 4, 5, 6, 7, 8, [9, 10]]
console.log('深度3:', flattenByDepth(testArr, 3)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 边界情况测试
console.log('负数深度:', flattenByDepth(testArr, -1)); // 原数组的浅拷贝
console.log('过大深度:', flattenByDepth(testArr, 10)); // 完全展开

// 验证不修改原数组
console.log('原数组未被修改:', testArr);