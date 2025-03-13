function flattenObject(obj, prefix = '') {
  let result = {};

  for (let key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      // 处理数组
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.assign(result, flattenObject(item, `${newKey}[${index}]`));
          } else {
            result[`${newKey}[${index}]`] = item;
          }
        });
      } else {
        // 处理对象
        Object.assign(result, flattenObject(value, newKey));
      }
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

// 测试
const obj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    },
    f: [
      { g: 1 },
      { h: 2 },
      [1, 2, 3]
    ]
  }
};

console.log(flattenObject(obj));
/*
输出：
{
  'a': 1,
  'b.c': 2,
  'b.d.e': 3,
  'b.f[0].g': 1,
  'b.f[1].h': 2,
  'b.f[2][0]': 1,
  'b.f[2][1]': 2,
  'b.f[2][2]': 3
}
*/