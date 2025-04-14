/*
 * @lc app=leetcode.cn id=560 lang=javascript
 *
 * [560] 和为 K 的子数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  const prefixSumCount = new Map();
  prefixSumCount.set(0, 1);

  let count = 0;
  let currentSum = 0;

  for (let i = 0; i < nums.length; i++) {
    currentSum += nums[i];

    if (prefixSumCount.has(currentSum - k)) {
      count += prefixSumCount.get(currentSum - k);
    }

    prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0 ) + 1);
  }

  return count;
};

// 前缀和 + 哈希表
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// @lc code=end
