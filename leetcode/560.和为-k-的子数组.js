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
  // 使用哈希表记录前缀和出现的次数
  const prefixSumCount = new Map();
  // 初始时前缀和为0的情况出现一次
  prefixSumCount.set(0, 1);

  let count = 0;
  let currentSum = 0;

  for (let i = 0; i < nums.length; i++) {
    // 计算当前位置的前缀和
    currentSum += nums[i];

    // 如果存在一个之前的前缀和，其值为(prefixSum - k)
    // 那么说明从该位置到当前位置的子数组和为k
    if (prefixSumCount.has(currentSum - k)) {
      count += prefixSumCount.get(currentSum - k);
    }

    // 更新哈希表中当前前缀和的计数
    prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0 ) + 1);
  }

  return count;
};

// 前缀和 + 哈希表
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// @lc code=end
