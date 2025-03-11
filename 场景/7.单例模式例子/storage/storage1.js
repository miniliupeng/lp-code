// 实现一个 Storage

// 实现Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)。

// 静态方法版
class Storage {
  static getInstance() {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }
  setItem(key, value) {
    localStorage.setItem(key, value);
  }
  getItem(key) {
    return localStorage.getItem(key);
  }
}

const storage1 = Storage.getInstance();
const storage2 = Storage.getInstance();
const storage3 = new Storage();

storage1.setItem('name', '李雷');
// 李雷
console.log(storage1.getItem('name'));
// 也是李雷
console.log(storage2.getItem('name'));

// 返回true
console.log(storage1 === storage2);
