/**
 * 创建一个支持无限调用和求和的 add 函数
 * @returns {Function} 可链式调用的函数，带有 sum 方法
 */
function add() {
  // 存储所有参数的数组
  const args = [...arguments];

  // 创建一个函数，用于继续收集参数
  function innerAdd() {
    // 将新参数添加到参数数组
    args.push(...arguments);
    // 返回自身以支持链式调用
    return innerAdd;
  }

  // 添加 sum 方法，计算所有参数的总和
  innerAdd.sum = function () {
    return args.reduce((total, num) => total + num, 0);
  };

  // 添加 valueOf 方法，使函数在隐式转换时返回总和
  innerAdd.valueOf = function () {
    return innerAdd.sum();
  };

  // 添加 toString 方法，使函数在字符串转换时返回总和
  innerAdd.toString = function () {
    return innerAdd.sum().toString();
  };

  return innerAdd;
}

// 测试用例
console.log(add(1, 2, 3).sum()); // 6
console.log(add(1)(2, 3).sum()); // 6
console.log(add(1, 2)(3).sum()); // 6
console.log(add(1)(2)(3).sum()); // 6
console.log(add(1, 2, 3, 4, 5).sum()); // 15
console.log(add(1)(2)(3)(4)(5).sum()); // 15
console.log(add(1, 2)(3, 4)(5).sum()); // 15

// 隐式转换测试
console.log(add(1, 2, 3) + 0); // 6
console.log('' + add(1)(2)(3)); // "6"
