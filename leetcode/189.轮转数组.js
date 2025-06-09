/*
 * @lc app=leetcode.cn id=189 lang=javascript
 *
 * [189] 轮转数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
  // 处理k大于数组长度的情况
  k = k % nums.length;
  
  // 如果k为0，不需要轮转
  if (k === 0) return;

  // 三次反转法
  // 反转整个数组
  reverse(nums, 0, nums.length - 1);
  // 反转前k个元素
  reverse(nums, 0, k - 1);
  // 反转剩余元素
  reverse(nums, k, nums.length - 1);
};

// 辅助函数：反转数组中从start到end的元素
function reverse(nums, start, end) {
  while (start < end) {
    // 交换元素
    [nums[start], nums[end]] = [nums[end], nums[start]];
    start++;
    end--;
  }
}
// @lc code=end
