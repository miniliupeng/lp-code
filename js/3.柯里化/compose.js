// 函数组合
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// 柯里化的函数更容易组合
const add10 = x => x + 10;
const multiply2 = x => x * 2;
const subtract5 = x => x - 5;

const calculate = compose(subtract5, multiply2, add10);
console.log(calculate(5)); // ((5 + 10) * 2) - 5 = 25
