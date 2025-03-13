/**
 * 获取对象中的值，支持路径访问
 * @param {Object} obj - 要查询的对象
 * @param {string|Array} path - 属性路径
 * @param {*} defaultValue - 默认值
 * @returns {*} 查找到的值或默认值
 */
function get(obj, path, defaultValue) {
  // 处理空对象的情况
  if (obj == null) {
    return defaultValue;
  }

  // 将路径转换为数组
  const keys = Array.isArray(path) 
    ? path 
    : path.replace(/\[(\d+)\]/g, '.$1').split('.');

  // 遍历路径
  let result = obj;
  for (const key of keys) {
    // 处理空值
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  // 如果最终结果是 undefined，返回默认值
  return result === undefined ? defaultValue : result;
}

// 测试用例
const object = {
  a: {
    b: {
      c: 3
    },
    'x.y': 5
  },
  arr: [
    { id: 1 },
    { id: 2 }
  ]
};

console.log(get(object, 'a.b.c'));           // 3
console.log(get(object, ['a', 'b', 'c']));   // 3
console.log(get(object, 'a.b.d', 'default')); // 'default'
console.log(get(object, 'arr[0].id'));       // 1
console.log(get(object, 'a["x.y"]'));        // 5
console.log(get(object, 'x.y.z', null));     // null
console.log(get(null, 'a.b.c', 'default'));  // 'default'