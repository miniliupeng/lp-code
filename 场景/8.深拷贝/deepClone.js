// 深拷贝
function deepClone(obj, hash = new WeakMap()) {
  // 处理基本类型和 null
  if (typeof obj !== 'object' || obj === null) {
    // 处理函数
    if (typeof obj === 'function') {
      return function () {
        return obj.apply(this, arguments);
      };
    }
    return obj;
  }

  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理正则表达式
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 获取对象的构造函数
  const constructor = obj.constructor;

  // 创建新对象
  const cloneObj = new constructor();

  // 将当前对象存入 WeakMap，处理循环引用
  hash.set(obj, cloneObj);

  // 处理 Symbol 属性
  const symbolProperties = Object.getOwnPropertySymbols(obj);
  if (symbolProperties.length > 0) {
    symbolProperties.forEach((symbol) => {
      cloneObj[symbol] = deepClone(obj[symbol], hash);
    });
  }

  // 处理 Map
  if (obj instanceof Map) {
    obj.forEach((value, key) => {
      // 处理 Map 的 key 和 value 都可能是 Symbol 的情况
      cloneObj.set(deepClone(key, hash), deepClone(value, hash));
    });
    return cloneObj;
  }

  // 处理 Set
  if (obj instanceof Set) {
    obj.forEach((value) => {
      cloneObj.add(deepClone(value, hash));
    });
    return cloneObj;
  }

  // 处理对象和数组的常规属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}

// 测试代码
const sym1 = Symbol('test1');
const sym2 = Symbol('test2');

const obj = {
  name: '张三',
  age: 18,
  birthday: new Date('1990-01-01'),
  pattern: /\w+/g,
  address: {
    city: '北京',
    province: '北京'
  },
  hobbies: ['读书', '游泳'],
  friends: new Set(['李四', '王五']),
  scores: new Map([
    ['语文', 90],
    ['数学', 95]
  ]),
  // Symbol 属性
  [sym1]: 'Symbol值1',
  [sym2]: {
    value: 'Symbol值2'
  },
  // 函数属性
  sayHello: function () {
    console.log(`你好，我是${this.name}`);
  },
  // 箭头函数
  getAge: () => {
    return this.age;
  }
};

// 创建循环引用
obj.self = obj;

const clonedObj = deepClone(obj);
console.log(clonedObj);
// 测试函数拷贝
clonedObj.sayHello(); // 输出：你好，我是张三
// 测试 Symbol 属性
console.log(clonedObj[sym1]); // 输出：Symbol值1
console.log(clonedObj[sym2].value); // 输出：Symbol值2
