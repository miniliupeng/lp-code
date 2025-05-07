class MyPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    // console.log('constructor');

    // 初始化状态
    this.status = MyPromise.PENDING;
    this.value = undefined;
    this.reason = undefined;
    // 存储成功和失败的回调函数
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // resolve 处理函数
    const resolve = (value) => {
      // console.log('resolve');

      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    // reject 处理函数
    const reject = (reason) => {
      // console.log('reject');
      if (this.status === MyPromise.PENDING) {
        this.status = MyPromise.REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      // 立即执行executor
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // console.log('then');

    // 处理参数可选
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 实现链式调用
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === MyPromise.FULFILLED) {
        // console.log('promise2 FULFILLED');
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === MyPromise.REJECTED) {
        // console.log('promise2 REJECTED');
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === MyPromise.PENDING) {
        // console.log('promise2 PENDING');
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }

  // 将现有对象转为 Promise 对象
  static resolve(value) {
    // 如果 value 是一个 Promise 对象，则直接返回该对象
    if (value instanceof MyPromise) return value;

    // 如果 value 是一个对象或函数，则尝试解析该对象或函数
    if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
      try {
        const then = value.then;
        if (typeof then === 'function') {
          return new MyPromise(then.bind(value));
        }
      } catch (error) {
        return new MyPromise((resolve, reject) => reject(error));
      }
    }

    // 如果 value 不是对象或函数，则直接返回一个以 value 为值的 Promise 对象
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    // 返回一个以 reason 为值的 Promise 对象
    return new MyPromise((resolve, reject) => reject(reason));
  }

  catch(onRejected) {
    // 返回一个 Promise 对象，当 promise 失败时，执行 onRejected 回调函数
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    // 返回一个 Promise 对象，当 promise 成功或失败时，都会执行 onFinally 回调函数
    return this.then(
      (value) => MyPromise.resolve(onFinally()).then(() => value),
      (reason) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        })
    );
  }

  static all(promises) {
    // 返回一个 Promise 对象，当所有 promise 都成功时，返回一个包含所有成功值的数组
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise)
          .then((value) => {
            results[index] = value;
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          })
          .catch(reject);
      });
    });
  }

  static race(promises) {
    // 返回一个 Promise 对象，当任意一个 promise 成功或失败时，返回该 promise 的值或原因
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        MyPromise.resolve(promise).then(resolve).catch(reject);
      });
    });
  }

  static allSettled(promises) {
    // 返回一个 Promise 对象，当所有 promise 都成功或失败时，返回一个包含所有 promise 结果的数组
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise)
          .then((value) => {
            results[index] = { status: MyPromise.FULFILLED, value };
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          })
          .catch((reason) => {
            results[index] = { status: MyPromise.REJECTED, reason };
            count++;
            if (count === promises.length) {
              resolve(results);
            }
          });
      });
    });
  }

  static any(promises) {
    // 返回一个 Promise 对象，当任意一个 promise 成功时，返回该 promise 的值
    return new MyPromise((resolve, reject) => {
      let count = 0;
      let errors = [];

      promises.forEach((promise, index) => {
        MyPromise.resolve(promise)
          .then((value) => {
            resolve(value);
          })
          .catch((reason) => {
            errors[index] = reason;
            count++;
            if (count === promises.length) {
              reject(new AggregateError(errors, 'All promises were rejected'));
            }
          });
      });
    });
  }

  static retry(fn, times, delay = 0) {
    return new MyPromise((resolve, reject) => {
      let attempts = 0;

      const attempt = () => {
        MyPromise.resolve(fn())
          .then(resolve)
          .catch((error) => {
            attempts++;
            if (attempts === times) {
              reject(error);
            } else if (delay > 0) {
              setTimeout(attempt, delay);
            } else {
              attempt();
            }
          });
      };

      attempt();

      // while版本
      // const run = async () => {
      //   while (attempts < times) {
      //     try {
      //       const result = await MyPromise.resolve(fn());
      //       resolve(result);
      //       return;
      //     } catch (error) {
      //       attempts++;
      //       if (attempts === times) {
      //         reject(error);
      //         return;
      //       }
      //       if (delay > 0) {
      //         await new Promise(resolve => setTimeout(resolve, delay));
      //       }
      //     }
      //   }
      // };

      // run();
    });
  }
}

// 处理 Promise 解析过程
function resolvePromise(promise2, x, resolve, reject) {
  // 避免循环引用
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise'));
    return;
  }

  let called = false;

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then;

      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}

// 基本使用
const promise = new MyPromise((resolve, reject) => {
  // console.log('executor');

  setTimeout(() => {
    resolve('成功');
  }, 1000);
});

promise.then(
  (value) => console.log(value),
  (reason) => console.log(reason)
);

// // 链式调用
// promise
//   .then((value) => {
//     return new MyPromise((resolve) => resolve(value + '！'));
//   })
//   .then((value) => {
//     console.log(value); // 输出：成功！
//   });




// 测试 retry
function testRetry() {
  let counter = 0;
  
  function flakeyFunction() {
    return new MyPromise((resolve, reject) => {
      counter++;
      console.log(`尝试第 ${counter} 次`);
      
      // 前两次调用会失败，第三次成功
      if (counter < 3) {
        reject(new Error(`失败了，这是第 ${counter} 次尝试`));
      } else {
        resolve(`成功了！这是第 ${counter} 次尝试`);
      }
    });
  }
  
  console.log('开始测试 retry 方法...');
  
  // 尝试最多3次，每次失败后延迟1000ms
  MyPromise.retry(flakeyFunction, 3, 1000)
    .then(result => {
      console.log('最终结果:', result);
    })
    .catch(error => {
      console.error('所有重试都失败了:', error.message);
    });
}

testRetry();