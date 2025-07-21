/*
 * @lc app=leetcode.cn id=70 lang=javascript
 *
 * [70] 爬楼梯
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
  if (n <= 2) {
    return n;
  }

  let prev = 1; // 爬到第1阶的方法数
  let curr = 2; // 爬到第2阶的方法数

  for (let i = 3; i <= n; i++) {
    let temp = curr;
    curr = prev + curr; // 爬到当前阶的方法数 = 爬到前一阶的方法数 + 爬到前两阶的方法数
    prev = temp;
  }

  return curr;
};
// @lc code=end

// 采用动态规划思路：

// 1. 当楼梯阶数 n ≤ 2 时，方法数就是 n（1阶有1种方法，2阶有2种方法）
// 2. 对于 n > 2 的情况，使用迭代计算：
//    - 到达第 i 阶的方法数 = 到达第 i-1 阶的方法数 + 到达第 i-2 阶的方法数
//    - 这是因为最后一步可以爬1阶或爬2阶

// 算法空间复杂度为 O(1)，时间复杂度为 O(n)。
