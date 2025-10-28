/**
 * 设置对象中指定路径的值，如果路径不存在则创建
 * @param {Object} obj - 要修改的对象
 * @param {string|Array} path - 属性路径
 * @param {*} value - 要设置的值
 * @returns {Object} 返回修改后的对象
 */
function set(obj, path, value) {
  // 如果对象为空，创建一个新对象
  if (obj == null) {
    obj = {};
  }

  // 将路径转换为数组
  const keys = Array.isArray(path) 
    ? path 
    : path.replace(/\[(\d+)\]/g, '.$1').split('.');

  // 遍历路径，创建不存在的中间对象
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    // 如果当前键不存在或不是对象，创建新对象或数组
    if (current[key] == null || typeof current[key] !== 'object') {
      // 判断下一个键是否为数字，决定创建数组还是对象
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }

    current = current[key];
  }

  // 设置最后一个键的值
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// 测试用例
const object = {
  a: {
    b: {
      c: 3
    }
  }
};

console.log('原始对象:', JSON.stringify(object, null, 2));

// 修改已存在的路径
set(object, 'a.b.c', 4);
console.log('set(object, "a.b.c", 4):', JSON.stringify(object, null, 2));

// 创建新路径
set(object, 'a.b.d', 5);
console.log('set(object, "a.b.d", 5):', JSON.stringify(object, null, 2));

// 使用数组路径
set(object, ['a', 'x', 'y'], 'hello');
console.log('set(object, ["a", "x", "y"], "hello"):', JSON.stringify(object, null, 2));

// 创建数组路径
set(object, 'arr[0].id', 1);
console.log('set(object, "arr[0].id", 1):', JSON.stringify(object, null, 2));

set(object, 'arr[1].id', 2);
console.log('set(object, "arr[1].id", 2):', JSON.stringify(object, null, 2));

// 深层嵌套路径
set(object, 'deep.nested.path.value', 'deep value');
console.log('set(object, "deep.nested.path.value", "deep value"):', JSON.stringify(object, null, 2));

// 空对象
const emptyObj = {};
set(emptyObj, 'a.b.c', 100);
console.log('空对象设置后:', JSON.stringify(emptyObj, null, 2));

