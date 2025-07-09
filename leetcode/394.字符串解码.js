/*
 * @lc app=leetcode.cn id=394 lang=javascript
 *
 * [394] 字符串解码
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function(s) {
    // 使用两个栈，一个存储数字（重复次数），一个存储字符串
    const numStack = [];
    const strStack = [];
    
    let currentNum = 0;
    let currentStr = '';
    
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        
        if (!isNaN(char)) {
            // 如果是数字，收集完整的数字
            currentNum = currentNum * 10 + parseInt(char);
        } else if (char === '[') {
            // 遇到左括号，将当前数字和字符串入栈
            numStack.push(currentNum);
            strStack.push(currentStr);
            // 重置当前数字和字符串
            currentNum = 0;
            currentStr = '';
        } else if (char === ']') {
            // 遇到右括号，出栈处理
            const repeatTimes = numStack.pop();
            const prevStr = strStack.pop();
            // 将当前字符串重复对应次数后，与之前的字符串拼接
            currentStr = prevStr + currentStr.repeat(repeatTimes);
        } else {
            // 如果是字母，直接添加到当前字符串
            currentStr += char;
        }
    }
    
    return currentStr;
};
// @lc code=end

