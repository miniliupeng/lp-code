/*
 * @lc app=leetcode.cn id=42 lang=javascript
 *
 * [42] 接雨水
 */

// @lc code=start
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function (height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let result = 0;

  while (left < right) {
    // 更新左右两边的最大高度
    leftMax = Math.max(leftMax, height[left]);
    rightMax = Math.max(rightMax, height[right]);

    // 从小的一遍收集雨水
    if (leftMax < rightMax) {
      result += leftMax - height[left];
      left++;
    } else {
      result += rightMax - height[right];
      right--;
    }
  }
  return result;
};
// @lc code=end
