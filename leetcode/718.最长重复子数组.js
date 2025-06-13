/*
 * @lc app=leetcode.cn id=718 lang=javascript
 *
 * [718] 最长重复子数组
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function (nums1, nums2) {
  let maxLength = 0;
  const m = nums1.length;
  const n = nums2.length;

  // 创建二维dp数组，初始化为0
  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));

  // 遍历nums1和nums2
  for (let i = 1; i < m + 1; i++) {
    for (let j = 1; j < n + 1; j++) {
      // 如果当前元素相等，则可以在之前的最长公共子数组基础上加1
      if (nums1[i - 1] === nums2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        maxLength = Math.max(maxLength, dp[i][j]);
      }
    }
  }

  return maxLength;
};
// @lc code=end
