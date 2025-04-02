/*
 * @lc app=leetcode.cn id=283 lang=javascript
 *
 * [283] 移动零
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  let nonZeroIndex = 0;

  // 第一步：将所有非零元素移到数组前面
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[nonZeroIndex] = nums[i];
      nonZeroIndex++;
    }
  }

  // 第二步：将剩余位置填充为0
  for (let i = nonZeroIndex; i < nums.length; i++) {
    nums[i] = 0;
  }
};
// @lc code=end
