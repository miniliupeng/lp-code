/*
 * @lc app=leetcode.cn id=22 lang=javascript
 *
 * [22] 括号生成
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    const result = [];

    /**
     * @param {string} currentString - 当前构建的字符串
     * @param {number} openCount - 已使用的左括号数
     * @param {number} closeCount - 已使用的右括号数
     */
    function backtrack(currentString, openCount, closeCount) {
        // 如果字符串长度达到 2*n，说明一个组合已经完成
        if (currentString.length === n * 2) {
            result.push(currentString);
            return;
        }

        // 如果左括号数量小于 n，可以添加一个左括号
        if (openCount < n) {
            backtrack(currentString + '(', openCount + 1, closeCount);
        }

        // 如果右括号数量小于左括号数量，可以添加一个右括号
        if (closeCount < openCount) {
            backtrack(currentString + ')', openCount, closeCount + 1);
        }
    }

    // 从空字符串开始递归
    backtrack('', 0, 0);
    return result;
};
// @lc code=end

// 思路是：
// 在每一步，我们都有两个选择：
// 1. 添加一个左括号 `(`
// 2. 添加一个右括号 `)`

// 但是这些选择是有限制的：
// 1. 只有当已使用的左括号数量小于 `n` 时，我们才能添加左括号。
// 2. 只有当已使用的右括号数量小于已使用的左括号数量时，我们才能添加右括号，以确保括号的有效性。
// 3. 当我们构建的字符串长度达到 `2 * n` 时，我们找到了一个有效的组合，将它添加到结果中。
