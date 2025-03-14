/*
 * @lc app=leetcode.cn id=387 lang=javascript
 *
 * [387] 字符串中的第一个唯一字符
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
  // 使用 Map 记录每个字符出现的次数
  const charCount = new Map();

  // 第一次遍历：统计每个字符出现的次数
  for (let char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // 第二次遍历：找到第一个出现次数为1的字符
  for (let i = 0; i < s.length; i++) {
    if (charCount.get(s[i]) === 1) {
      return i;
    }
  }

  return -1; // 如果没有找到不重复的字符，返回-1
};
// @lc code=end
