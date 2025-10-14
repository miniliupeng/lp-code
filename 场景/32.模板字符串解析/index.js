function render(template, data) {
  // 正则表达式匹配 ${key} 形式的占位符
  const reg = /\${(\w+)}/g;

  // 使用 String.prototype.replace 和一个回调函数来进行替换
  // replace 方法的第二个参数可以是一个函数
  // 这个函数会在每次匹配成功时执行
  // 函数的第一个参数是匹配到的整个字符串 (e.g., "${name}")
  // 第二个参数是第一个捕获组的内容 (e.g., "name")
  return template.replace(reg, (match, key) => {
    // 检查 data 对象中是否存在对应的 key
    if (data.hasOwnProperty(key)) {
      return data[key];
    }
    // 如果没有找到，返回原始匹配的字符串
    return match;
  });
}

// --- 示例 ---

const template = '你好，我叫${name}，今年${age}岁。我来自${city}。';
const data = {
  name: '张三',
  age: 25,
  city: '北京'
};

const result = render(template, data);
console.log(result); // 输出: "你好，我叫张三，今年25岁。我来自北京。"

// --- 示例2: 缺少数据 ---
const data2 = {
  name: '李四'
};
const result2 = render(template, data2);
console.log(result2); // 输出: "你好，我叫李四，今年${age}岁。我来自${city}。"
