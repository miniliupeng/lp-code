/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  const set = new Set();
  let maxLength = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    // 如果发现重复字符，则从左边开始删除字符，直到没有重复
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    // 将当前字符加入集合
    set.add(s[right]);

    // 更新最大长度
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
};
// @lc code=end
