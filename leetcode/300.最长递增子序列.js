/*
 * @lc app=leetcode.cn id=300 lang=javascript
 *
 * [300] 最长递增子序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
  // dp[i] 表示以 nums[i] 结尾的最长递增子序列的长度
  const dp = new Array(nums.length).fill(1);
  let maxLength = 1;
  
  for (let i = 1; i < nums.length; i++) {
      for (let j = 0; j < i; j++) {
          if (nums[i] > nums[j]) {
              dp[i] = Math.max(dp[i], dp[j] + 1);
          }
      }
      maxLength = Math.max(maxLength, dp[i]);
  }
  
  return maxLength;
};
// @lc code=end


// **时间复杂度：** O(n²)，两层嵌套循环
// **空间复杂度：** O(n)，dp数组

// ### 贪心 + 二分查找解法：

// var lengthOfLIS = function(nums) {
    
//     // tails[i] 表示长度为 i+1 的递增子序列的最小结尾值
//     const tails = [nums[0]];
    
//     for (let i = 1; i < nums.length; i++) {
//         if (nums[i] > tails[tails.length - 1]) {
//             // 如果当前数大于tails最后一个元素，直接添加
//             tails.push(nums[i]);
//         } else {
//             // 二分查找，找到第一个大于等于nums[i]的位置并替换
//             let left = 0, right = tails.length - 1;
//             while (left < right) {
//                 const mid = Math.floor((left + right) / 2);
//                 if (tails[mid] < nums[i]) {
//                     left = mid + 1;
//                 } else {
//                     right = mid;
//                 }
//             }
//             tails[left] = nums[i];
//         }
//     }
    
//     return tails.length;
// };


// **时间复杂度：** O(n log n)，遍历数组O(n)，二分查找O(log n)
// **空间复杂度：** O(n)，tails数组

// ### 记忆要点

// 1. **动态规划公式**：dp[i] = max(dp[i], dp[j] + 1)，其中j < i且nums[j] < nums[i]
// 2. **贪心思想**：对于同样长度的递增子序列，结尾越小越好（为后面留更多可能）
// 3. **二分查找**：在tails数组中寻找第一个大于等于当前元素的位置

// 这道题是经典的动态规划题目，适合用于理解DP的思想以及如何使用贪心+二分优化DP问题。