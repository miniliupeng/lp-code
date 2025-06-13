/**
 * JavaScript 提取括号内容的方法
 */

// 示例字符串
const testStr1 = "这是一个(示例)字符串";
const testStr2 = "第一个(示例)和第二个(测试)";
const testStr3 = "外层(内层1(嵌套)内层2)另一个(示例)";
const testStr4 = "圆括号(示例)，方括号[测试]，花括号{样本}";

/**
 * 方法1: 提取单对括号中的内容
 */
function extractSingleParentheses(str) {
  const regex = /\(([^)]*)\)/;
  const match = str.match(regex);
  
  return match ? match[1] : null;
}

console.log("方法1 - 提取单对括号:");
console.log(extractSingleParentheses(testStr1)); // 输出: "示例"

/**
 * 方法2: 提取多对括号中的内容 (使用exec循环)
 */
function extractMultipleParenthesesWithExec(str) {
  const regex = /\(([^)]*)\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(str)) !== null) {
    matches.push(match[1]);
  }
  
  return matches;
}

console.log("\n方法2 - 提取多对括号 (exec循环):");
console.log(extractMultipleParenthesesWithExec(testStr2)); // 输出: ["示例", "测试"]

/**
 * 方法2b: 提取多对括号中的内容 (使用match和map)
 */
function extractMultipleParenthesesWithMatch(str) {
  const matches = str.match(/\(([^)]*)\)/g)
                     ?.map(match => match.slice(1, -1)) || [];
  
  return matches;
}

console.log("\n方法2b - 提取多对括号 (match和map):");
console.log(extractMultipleParenthesesWithMatch(testStr2)); // 输出: ["示例", "测试"]

/**
 * 方法3: 处理嵌套括号的情况
 */
function extractNestedParentheses(str) {
  const results = [];
  let stack = [];
  let start = -1;
  
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') {
      if (stack.length === 0) {
        start = i;
      }
      stack.push('(');
    } else if (str[i] === ')') {
      stack.pop();
      if (stack.length === 0 && start !== -1) {
        results.push(str.substring(start + 1, i));
        start = -1;
      }
    }
  }
  
  return results;
}

console.log("\n方法3 - 处理嵌套括号:");
console.log(extractNestedParentheses(testStr3)); // 输出: ["内层1(嵌套)内层2", "示例"]

/**
 * 方法4: 使用matchAll方法 (ES2020+)
 */
function extractWithMatchAll(str) {
  const regex = /\(([^)]*)\)/g;
  const matches = [...str.matchAll(regex)].map(match => match[1]);
  
  return matches;
}

console.log("\n方法4 - 使用matchAll方法:");
console.log(extractWithMatchAll(testStr2)); // 输出: ["示例", "测试"]

/**
 * 方法5: 处理不同类型的括号
 */
function extractDifferentBrackets(str) {
  const regex = /[\(\[\{]([^\)\]\}]*)[\)\]\}]/g;
  const matches = [...str.matchAll(regex)].map(match => match[1]);
  
  return matches;
}

console.log("\n方法5 - 处理不同类型的括号:");
console.log(extractDifferentBrackets(testStr4)); // 输出: ["示例", "测试", "样本"]

