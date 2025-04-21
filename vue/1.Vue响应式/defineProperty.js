// 模拟Vue2的响应式系统
function observe(obj) {
  if (!obj || typeof obj !== 'object') return;
  
  // 遍历对象的所有属性
  Object.keys(obj).forEach(key => {
    // 保存属性原始值
    let value = obj[key];
    
    // 递归处理嵌套对象
    observe(value);
    
    // 使用defineProperty拦截属性的访问和修改
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log(`获取属性: ${key}, 值为: ${value}`);
        return value;
      },
      set(newValue) {
        if (value === newValue) return;
        console.log(`设置属性: ${key}, 新值为: ${newValue}, 旧值为: ${value}`);
        value = newValue;
        // 如果新值是对象，也要将其转换为响应式
        observe(newValue);
        // 触发更新视图(这里用console.log模拟)
        console.log('视图更新');
      }
    });
  });
}

// 创建响应式数据
const data = {
  message: 'Hello Vue',
  user: {
    name: '张三',
    age: 25
  },
  list: [1, 2, 3]
};

// 将数据转换为响应式
observe(data);

// 测试响应式效果
console.log(data.message); // 读取
data.message = 'Hello World'; // 修改基本类型
data.user.name = '李四'; // 修改嵌套对象
data.user = { name: '王五', age: 30 }; // 修改整个对象
