// 实现mergePromise函数，把传进去的数组按顺序先后执行，并且把返回的数据先后放到数组data中

const time = (timer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
};
const ajax1 = () =>
  time(2000).then(() => {
    console.log(1);
    return 1;
  });
const ajax2 = () =>
  time(1000).then(() => {
    console.log(2);
    return 2;
  });
const ajax3 = () =>
  time(1000).then(() => {
    console.log(3);
    return 3;
  });

async function mergePromise(queue) {
  const res = []
    // 在这里写代码

  // return queue.reduce((pre, cur) => {
  //   return pre.then(cur).then(val => {
  //     res.push(val)
  //     return res
  //   })
  // }, Promise.resolve())

  for (const element of queue) {
    res.push(await element())
  }
  return res
}

mergePromise([ajax1, ajax2, ajax3]).then((data) => {
  console.log('done');
  console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]
