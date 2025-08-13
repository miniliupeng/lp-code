
/**
 * 将一个遵循常见的错误优先回调风格的函数（即最后一个参数是一个 (err, value) => ... 回调）转换成一个返回 Promise 的版本。
 * @param {Function} fn 接受回调的异步函数
 * @returns {Function} 返回一个 Promise 的新函数
 */
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      // 将我们的自定义回调添加到参数列表末尾
      fn(...args, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  };
}

// --- 测试用例 ---

// 1. 创建一个模拟异步函数，它接受一个回调
// 模拟一个成功的情况
function asyncOperationSuccess(value, callback) {
  console.log('开始执行 (成功)...');
  setTimeout(() => {
    callback(null, `操作成功，值为: ${value}`);
  }, 1000);
}

// 模拟一个失败的情况
function asyncOperationFailure(value, callback) {
  console.log('开始执行 (失败)...');
  setTimeout(() => {
    callback(new Error('操作失败'), null);
  }, 1000);
}