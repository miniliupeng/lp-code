function flattenObject(obj) {
  const result = {};
  
  function flatten(obj, prefix = '') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const newKey = prefix ? 
          (Array.isArray(obj) ? `${prefix}[${key}]` : `${prefix}.${key}`) : 
          key;
        
        if (typeof value === 'object' && value !== null) {
          flatten(value, newKey);
        } else {
          result[newKey] = value;
        }
      }
    }
  }
  
  flatten(obj);
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