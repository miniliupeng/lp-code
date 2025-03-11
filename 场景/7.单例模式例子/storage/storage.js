// 闭包版
function StorageBase() {}

StorageBase.prototype.setItem = function (key, value) {
  localStorage.setItem(key, value);
};

StorageBase.prototype.getItem = function (key) {
  return localStorage.getItem(key);
};

const Storage = (function () {
  let instance = null;
  return function () {
    if (!instance) {
      instance = new StorageBase();
    }
    return instance;
  };
})();

const storage1 = new Storage();
const storage2 = new Storage();

storage1.setItem('name', '李雷');

console.log(storage1.getItem('name'));
console.log(storage2.getItem('name'));

console.log(storage1 === storage2);
