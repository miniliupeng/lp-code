/**
 * 实现一个深拷贝函数，满足以下功能：
 * 1. 基本类型处理：直接返回原值
 * 2. 函数处理：返回原函数
 * 3. 特殊对象处理：Date、RegExp
 * 4. 循环引用处理：使用WeakMap记录已克隆的对象
 * 5. 复杂数据类型处理：Map、Set、普通对象和数组
 * 6. Symbol类型处理：复制Symbol类型的属性
 * 7. 保留原型链
 *
 * @param {any} target - 需要被深拷贝的目标
 * @param {WeakMap} [map=new WeakMap()] - 用于存储已拷贝对象的哈希表，处理循环引用
 * @returns {any} - 拷贝后的新对象
 */
function deepClone(target, map = new WeakMap()) {
  // 1. 处理原始类型、函数和 null
  // 对于原始类型(string, number, boolean, symbol, bigint, undefined)和函数，直接返回自身
  // typeof null === 'object', 因此需要额外判断
  if (target === null || typeof target !== 'object') {
      return target;
  }

  // 2. 循环引用处理
  if (map.has(target)) {
      return map.get(target);
  }
  
  // 3. 特殊对象处理：Date, RegExp
  const constructor = target.constructor;
  if (constructor === Date || constructor === RegExp) {
      return new constructor(target);
  }

  // 4. 复杂数据类型处理：Map, Set
  if (target instanceof Map) {
      const cloneTarget = new Map();
      map.set(target, cloneTarget);
      target.forEach((value, key) => {
          cloneTarget.set(deepClone(key, map), deepClone(value, map));
      });
      return cloneTarget;
  }

  if (target instanceof Set) {
      const cloneTarget = new Set();
      map.set(target, cloneTarget);
      target.forEach(value => {
          cloneTarget.add(deepClone(value, map));
      });
      return cloneTarget;
  }
  
  // 5. 初始化拷贝后的普通对象或数组，同时保留原型链
  const cloneTarget = Array.isArray(target)
      ? []
      : Object.create(Object.getPrototypeOf(target));

  map.set(target, cloneTarget);
  
  // 6. 递归处理普通对象和数组的属性（包括Symbol属性和不可枚举属性）
  for (const key of Reflect.ownKeys(target)) {
      cloneTarget[key] = deepClone(target[key], map);
  }

  return cloneTarget;
}


// --- 测试用例 ---

console.log('--- 基本功能测试 ---');
const original = {
  a: 1,
  b: 'string',
  c: true,
  d: null,
  e: undefined,
  f: Symbol('id'),
  g: new Date(),
  h: /ab+c/i,
  i: function() { console.log('hello'); },
  j: { nested: { n: 100 } },
  k: [1, 2, { arr_obj: 3 }],
  l: new Map([['key1', 'value1'], ['key2', { map_obj: 2 }]]),
  m: new Set([1, 2, 3, { set_obj: 4 }]),
};
original.self = original; // 循环引用

// 添加一个继承属性，验证原型链
const proto = { inheritedProp: "I am inherited" };
const objWithProto = Object.create(proto);
objWithProto.ownProp = "I am own";
original.n = objWithProto;


const cloned = deepClone(original);

console.log('原始对象:', original);
console.log('克隆对象:', cloned);

console.log('\n--- 验证深拷贝 ---');
// 修改克隆对象的属性，不应影响原始对象
cloned.a = 10;
cloned.j.nested.n = 200;
cloned.k[2].arr_obj = 300;
cloned.l.get('key2').map_obj = 200;
cloned.m.forEach(item => {
  if (typeof item === 'object') item.set_obj = 400;
});

console.log('修改克隆对象后，原始对象的 a:', original.a); // 1
console.log('修改克隆对象后，原始对象的 j.nested.n:', original.j.nested.n); // 100
console.log('修改克隆对象后，原始对象的 k[2].arr_obj:', original.k[2].arr_obj); // 3
console.log('修改克隆对象后，原始对象的 l.get("key2").map_obj:', original.l.get('key2').map_obj); // 2
original.m.forEach(item => {
  if (typeof item === 'object') console.log('修改克隆对象后，原始对象的 set_obj:', item.set_obj); // 4
});


console.log('\n--- 验证特性 ---');
// 1. 验证循环引用
console.log('克隆对象的循环引用是否指向克隆对象本身:', cloned.self === cloned); // true

// 2. 验证原型链
console.log('克隆对象是否保留了原型链:', Object.getPrototypeOf(cloned.n) === proto); // true
console.log('克隆对象的继承属性:', cloned.n.inheritedProp); // "I am inherited"
cloned.n.ownProp = "I am changed";
console.log('修改克隆对象的自有属性后，原始对象的自有属性:', original.n.ownProp); // "I am own"

// 3. 验证函数
console.log('函数是否为同一个引用:', cloned.i === original.i); // true

// 4. 验证日期和正则
console.log('日期对象是否为新实例:', cloned.g !== original.g && cloned.g.getTime() === original.g.getTime()); // true
console.log('正则对象是否为新实例:', cloned.h !== original.h && cloned.h.source === original.h.source); // true

// 5. 验证 Symbol 属性
console.log('Symbol属性是否被拷贝:', cloned.f === original.f); // true, Symbol是基本类型，直接拷贝值
