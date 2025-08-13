/**
 * 给定一个普通的 JavaScript 对象 person，如下所示：
 */
const person = {
  name: "Alice",
  age: 25,
  gender: "female"
};

/**
 * 请将其转换为一个可迭代对象，使得可以通过 for...of 循环遍历该对象的键值对
 * (即每次迭代返回 [key, value] 形式的数组)。例如：
 * 
 * for (const [key, value] of person) {
 *   console.log(key, value);
 * }
 * 
 * // 输出:
 * // name Alice
 * // age 25
 * // gender female
 */

// --- 实现 ---

// 使用生成器函数 (Generator Function) 来实现 [Symbol.iterator]
person[Symbol.iterator] = function* () {
  // Object.keys(this) 获取对象的所有键组成的数组
  const keys = Object.keys(this);
  for (const key of keys) {
    // yield 关键字可以暂停函数的执行，并返回一个值。
    // 在 for...of 循环中，每次迭代都会从上一次暂停的地方继续执行，
    // 直到下一个 yield 或者函数结束。
    yield [key, this[key]];
  }
};

// --- 验证 ---
console.log('使用 for...of 遍历对象:');
for (const [key, value] of person) {
  console.log(key, value);
}

// 也可以手动使用迭代器
console.log('\\n手动使用迭代器:');
const iterator = person[Symbol.iterator]();
console.log(iterator.next()); // { value: [ 'name', 'Alice' ], done: false }
console.log(iterator.next()); // { value: [ 'age', 25 ], done: false }
console.log(iterator.next()); // { value: [ 'gender', 'female' ], done: false }
console.log(iterator.next()); // { value: undefined, done: true }


/**
 * 可迭代对象的原理说明
 *
 * 在 JavaScript 中，可迭代对象 (iterable) 是指实现了 [Symbol.iterator] 方法的对象。
 * 这个方法需要返回一个符合 迭代器协议 (iterator protocol) 的对象，即包含 next() 方法的对象。
 * next() 方法每次调用时返回一个具有以下结构的对象：
 * {
 *   value: any,  // 当前迭代的值
 *   done: boolean // 是否已经完成迭代
 * }
 *
 * 透过实现 [Symbol.iterator] 方法，我们可以让普通对象变得可迭代，从而支持 for...of 循环。
 * 生成器函数是实现迭代器的一种非常方便的语法糖。
 */
