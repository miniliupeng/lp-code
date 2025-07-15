/*
 * @lc app=leetcode.cn id=55 lang=javascript
 *
 * [55] 跳跃游戏
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
  let maxReach = 0; // 最远可以到达的位置

  for (let i = 0; i < nums.length; i++) {
    // 如果当前位置无法到达，直接返回 false
    if (i > maxReach) return false;

    // 更新最远可以到达的位置
    maxReach = Math.max(maxReach, i + nums[i]);

    // 如果已经可以到达最后位置，直接返回 true
    if (maxReach >= nums.length - 1) return true;
  }

  return true;
};
// @lc code=end

// var canJump = function (nums) {
//   let goal = nums.length - 1;

//   for (let i = nums.length - 2; i >= 0; i--) {
//     if (i + nums[i] >= goal) {
//       goal = i;
//     }
//   }

//   return goal === 0;
// };

// 法二、从后往前遍历:

// 1.  我们将最后一个位置设为我们的目标 `goal`。
// 2.  然后从后往前遍历数组（从倒数第二个元素开始）。
// 3.  在每个位置 `i`，我们检查从这个位置是否能够跳到当前的 `goal` (即 `i + nums[i] >= goal`)。
// 4.  如果可以，说明我们只需要到达位置 `i` 就可以了，所以我们将 `goal` 更新为 `i`。
// 5.  循环结束后，如果 `goal` 最终变成了 0，说明从起始位置可以到达我们的目标。

// 这种方法的核心思想是不断更新能够到达终点的“最近”的起始位置。如果最后这个位置是数组的第一个位置（索引为0），那么就说明可以成功。
