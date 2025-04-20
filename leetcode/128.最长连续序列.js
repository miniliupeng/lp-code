/*
 * @lc app=leetcode.cn id=128 lang=javascript
 *
 * [128] 最长连续序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
  let total = 0;
  const set = new Set(nums);
  for (const item of set) {
    if (set.has(item - 1)) continue;
    let next = item + 1;
    while (set.has(next)) {
      next++;
    }
    total = Math.max(total, next - item);
  }

  return total;
};
// @lc code=end
