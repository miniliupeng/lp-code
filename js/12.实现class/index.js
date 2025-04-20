// es5实现class

// 定义构造函数
function Person(name, age) {
  // 实例属性
  this.name = name;
  this.age = age;
}

// 原型方法（相当于类的实例方法）
Person.prototype.sayHello = function() {
  console.log('Hello, my name is ' + this.name + ' and I am ' + this.age + ' years old.');
};

// 静态方法（直接添加到构造函数上）
Person.create = function(name, age) {
  return new Person(name, age);
};

// 静态属性
Person.species = 'Homo Sapiens';

// 使用示例
var person1 = new Person('Alice', 25);
person1.sayHello(); // "Hello, my name is Alice and I am 25 years old."

var person2 = Person.create('Bob', 30);
person2.sayHello(); // "Hello, my name is Bob and I am 30 years old."

console.log(Person.species); // "Homo Sapiens"

// 实现继承（子类）
function Student(name, age, grade) {
  // 调用父类构造函数
  Person.call(this, name, age);
  
  // 子类自己的属性
  this.grade = grade;
}

// 设置原型链，实现继承
Student.prototype = Object.create(Person.prototype);
// 修复构造函数指向
Student.prototype.constructor = Student;

// 添加/覆盖子类方法
Student.prototype.sayHello = function() {
  console.log('Hello, my name is ' + this.name + ', I am ' + this.age + ' years old, and I am in grade ' + this.grade + '.');
};

Student.prototype.study = function(subject) {
  console.log(this.name + ' is studying ' + subject);
};

// 继承静态方法和属性
Student.create = Person.create;
Student.species = Person.species;

// 使用子类
var student1 = new Student('Charlie', 16, 10);
student1.sayHello(); // "Hello, my name is Charlie, I am 16 years old, and I am in grade 10."
student1.study('Math'); // "Charlie is studying Math"

// 检查继承关系
console.log(student1 instanceof Student); // true
console.log(student1 instanceof Person); // true