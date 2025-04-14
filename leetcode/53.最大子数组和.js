/*
 * @lc app=leetcode.cn id=53 lang=javascript
 *
 * [53] 最大子数组和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
  // 初始化：第一个元素的值作为当前最大和和全局最大和
  let currentSum = nums[0];
  let maxSum = nums[0];

  // 从第二个元素开始遍历
  for (let i = 1; i < nums.length; i++) {
    // 状态转移：要么将当前元素加入前面的子数组，要么重新开始
    currentSum = Math.max(nums[i], currentSum + nums[i]);

    // 更新全局最大和
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
};
// @lc code=end
