Function.prototype.myBind = function(context, ...args) {
  const fn = this;
  
  if (typeof fn !== 'function') {
    throw new TypeError(`${fn} is not callable`);
  }
  
  return function boundFn(...innerArgs) {
    // 处理构造函数调用情况
    if (this instanceof boundFn) {
      return new fn(...args, ...innerArgs);
    }
    return fn.apply(context, [...args, ...innerArgs]);
  };
};

let obj = {
  ll: 'seve'
};
let func1 = function (a, b, c) {
  console.log(this.ll);
  console.log([a, b, c]);
}.myBind(obj, 1, 2);

func1(3); // seve
// [ 1, 2, 3 ]

// 构造函数使用示例
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayInfo = function() {
  console.log(`我的名字是${this.name}，今年${this.age}岁`);
};

// 使用myBind绑定构造函数
const CreatePerson = Person.myBind(null, '张三');

// 通过new调用绑定后的函数
const person = new CreatePerson(25);

console.log(person.name); // 张三
console.log(person.age); // 25
person.sayInfo(); // 我的名字是张三，今年25岁

// 验证person是Person的实例
console.log(person instanceof Person); // true