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

// 该解法采用贪心策略，时间复杂度为O(n)，空间复杂度为O(1)，其中n为数组长度。

// 算法关键点：
// 1. `maxPos`：维护从当前位置能够到达的最远位置
// 2. `end`：当前跳跃步数能到达的最远边界
// 3. `steps`：记录所需的最小跳跃次数

// 每次到达边界时，我们都要进行一次跳跃，并将边界更新为当前能达到的最远位置。由于我们在遍历过程中总是维护最远可达位置，所以这种贪心策略可以保证跳跃次数最少。

// 例如对于数组[2,3,1,1,4]：
// - 起始位置0，可跳最远至位置2，end=2，steps=1
// - 到达位置1，可跳最远至位置4，未到边界
// - 到达位置2(边界)，更新end=4，steps=2
// - 到达位置3，未到边界
// - 位置4是终点，返回steps=2