/*
 * @lc app=leetcode.cn id=239 lang=javascript
 *
 * [239] 滑动窗口最大值
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
// dismiss
var maxSlidingWindow = function(nums, k) {
    const deque = [];
    const result = []

    for (let i = 0; i < nums.length; i++) {
      // 移除不在窗口范围内的元素
      if (deque.length && deque[0] < i - k + 1) {
        deque.shift()
      }

      // 移除所有小于当前元素的元素
      while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
        deque.pop()
      }

      // 当前元素的索引加入队列
      deque.push(i);

      // 当窗口大小达到 k 时，将队列头部的元素加入结果
      if (i >= k - 1) {
        result.push(nums[deque[0]])
      }

    }


    return result
};
// @lc code=end
