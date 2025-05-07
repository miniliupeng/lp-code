// 实现 async/await 的核心原理

// 模拟 async 函数 - 将生成器函数转换为返回 Promise 的函数
function myAsync(generatorFn) {
  return function(...args) {
    // 创建生成器对象
    const generator = generatorFn.apply(this, args);
    
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
      // 定义处理生成器迭代的函数
      function handle(result) {
        if (result.done) {
          // 生成器完成，返回最终值
          return resolve(result.value);
        }
        
        // 将生成器产出的值转换为 Promise
        Promise.resolve(result.value)
          .then(res => {
            try {
              // 使用上一个 Promise 的结果继续执行生成器
              handle(generator.next(res));
            } catch (err) {
              reject(err);
            }
          }, err => {
            try {
              // 如果 Promise 被拒绝，将错误传回生成器
              handle(generator.throw(err));
            } catch (err) {
              reject(err);
            }
          });
      }
      
      try {
        // 开始执行生成器
        handle(generator.next());
      } catch (err) {
        reject(err);
      }
    });
  };
}

// 示例：使用生成器模拟一个 async 函数
function* gen() {
  const data1 = yield delay('数据1', 1000);
  console.log(data1);
  
  const data2 = yield delay('数据2', 500);
  console.log(data2);
  
  return '完成';
}

// 辅助函数：返回一个延迟解析的 Promise
function delay(value, ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`${value} 准备好了`);
      resolve(value);
    }, ms);
  });
}

// 使用我们自己实现的 async 函数
const asyncFn = myAsync(gen);

// 执行
console.log('开始执行');
asyncFn().then(
  result => console.log('成功：', result),
  error => console.log('失败：', error)
);
console.log('主线程继续执行');
