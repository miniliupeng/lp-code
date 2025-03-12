/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    // 计算需要寻找的补数
    const targetValue = target - nums[i];
    // 如果map中存在这个补数，就找到了答案
    if (map.has(targetValue)) {
      return [i, map.get(targetValue)];
    }
    // 将当前数及其下标存入map

    map.set(nums[i], i);
  }
  return [];
};
// @lc code=end
