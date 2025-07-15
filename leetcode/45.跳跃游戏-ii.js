/*
 * @lc app=leetcode.cn id=45 lang=javascript
 *
 * [45] 跳跃游戏 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
  let maxPos = 0; // 当前能跳到的最远位置
  let end = 0; // 当前步数能到达的边界
  let steps = 0; // 跳跃次数

  // 遍历数组（最后一个位置不用考虑，因为已经到达终点）
  for (let i = 0; i < nums.length - 1; i++) {
    // 更新能跳到的最远位置
    maxPos = Math.max(maxPos, i + nums[i]);

    // 如果到达当前步数的边界，需要进行一次跳跃
    if (i === end) {
      end = maxPos; // 更新边界为当前能到达的最远位置
      steps++; // 跳跃次数加1
    }
  }

  return steps;
};
// @lc code=end
