/*
 * @lc app=leetcode.cn id=238 lang=javascript
 *
 * [238] 除自身以外数组的乘积
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);

  // 第一步：计算每个位置左侧所有元素的乘积
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    result[i] = leftProduct
    leftProduct *= nums[i]
  }

  // 第二步：计算每个位置右侧所有元素的乘积并与左侧乘积相乘
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= rightProduct
    rightProduct *= nums[i]
  }

  return result;
};
// @lc code=end
