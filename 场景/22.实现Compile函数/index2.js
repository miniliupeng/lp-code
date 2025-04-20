// 实现一个compile函数，支持多级引用变量以及数组，能够解析嵌套的属性和数组索引
// 将模板字符串中的插值（如 {{user.name}}）编译为具体的值。例如，输入模板 "Hello, {{user.name}}!" 和数据 {user: {name: "Alice"}}，输出 "Hello, Alice!"。

/**
 * 编译模板字符串，将其中的插值表达式替换为对应的值
 * 支持多级属性引用和数组索引
 * 
 * @param {string} template - 包含插值表达式的模板字符串
 * @param {object} data - 用于替换插值表达式的数据对象
 * @returns {string} - 替换后的字符串
 */
function compile(template, data) {
  return template.replace(/\${(.*?)}/g, (match, path) => {
    try {
      // 处理包含数组索引的复杂路径，如 user.items[0]
      const value = evaluatePath(path.trim(), data);
      // 将undefined和null转换为空字符串
      return value !== undefined && value !== null ? value : '';
    } catch (error) {
      // 如果解析出错，返回原始的匹配字符串
      console.error(`Error evaluating path "${path}":`, error);
      return match;
    }
  });
}

/**
 * 根据路径从对象中获取值，支持属性访问和数组索引
 * 
 * @param {string} path - 属性路径，如 "user.items[0]"
 * @param {object} data - 数据对象
 * @returns {*} - 路径对应的值
 */
function evaluatePath(path, data) {
  // 分解带有数组索引的路径
  // 例如，将 "user.items[0].name" 解析为 ["user", "items[0]", "name"]
  const segments = path.split('.');
  
  let result = data;
  for (let segment of segments) {
    // 检查当前结果是否是null或undefined
    if (result === null || result === undefined) {
      return undefined;
    }
    
    // 处理数组索引，如 "items[0]"
    const arrayMatch = segment.match(/^([^\[]+)(\[\d+\])+/);
    
    if (arrayMatch) {
      // 提取属性名，如 "items"
      const propName = arrayMatch[1];
      result = result[propName];
      
      // 提取并应用所有数组索引，如 [0]
      const indexMatches = segment.match(/\[(\d+)\]/g);
      if (indexMatches) {
        for (let indexMatch of indexMatches) {
          const index = parseInt(indexMatch.slice(1, -1));
          if (result === undefined || result === null) {
            return undefined;
          }
          result = result[index];
        }
      }
    } else {
      // 普通属性访问
      result = result[segment];
    }
  }
  
  return result;
}

// 测试代码
const template =
  "Hello, ${user.name}! Your balance is ${user.balance}. You have ${user.items[0]} in your cart. and ${user.items[2].kk}";
const exprObj = {
  user: {
    name: "Alice",
    balance: 100.5,
    items: ["Item1", "Item2", { kk: 1 }],
  },
};
const compiledString = compile(template, exprObj);
console.log(compiledString);



