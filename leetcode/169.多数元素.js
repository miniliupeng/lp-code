/*
 * @lc app=leetcode.cn id=169 lang=javascript
 *
 * [169] 多数元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  // 摩尔投票法
  let candidate = nums[0];
  let count = 1;

  // 找出候选众数
  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i];
      count = 1;
    } else if (nums[i] === candidate) {
      count++;
    } else {
      count--;
    }
  }

  return candidate;
};
// @lc code=end

// 我实现了多数元素问题的解法，使用了摩尔投票算法（Boyer-Moore投票算法）。这是一种非常巧妙的算法，具有O(n)的时间复杂度和O(1)的空间复杂度。

// 算法思路：
// 1. 选取数组第一个元素作为候选多数元素，计数器设为1
// 2. 遍历数组其余元素：
//    - 如果计数器为0，更新候选元素为当前元素，并将计数器设为1
//    - 如果当前元素等于候选元素，计数器加1
//    - 如果当前元素不等于候选元素，计数器减1
// 3. 遍历结束后，候选元素即为所求的多数元素
