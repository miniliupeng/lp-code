/*
 * @lc app=leetcode.cn id=48 lang=javascript
 *
 * [48] 旋转图像
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  const n = matrix.length;

  // 沿主对角线翻转（左上到右下）
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // 沿垂直中线翻转
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < Math.floor(n / 2); j++) {
      [matrix[i][j], matrix[i][n - 1 - j]] = [matrix[i][n - 1 - j], matrix[i][j]];
    }
  }
};
// @lc code=end

// 解题思路如下：

// 1. 先沿主对角线（从左上到右下）翻转矩阵
//    - 交换matrix[i][j]和matrix[j][i]的值
//    - 只需要遍历对角线一侧的元素

// 2. 再沿垂直中线翻转矩阵
//    - 交换matrix[i][j]和matrix[i][n-1-j]的值
//    - 每行只需要遍历一半的元素

// 这样两步操作的组合效果就是将矩阵顺时针旋转90度，并且是原地修改，不需要额外的矩阵空间。

// 时间复杂度是O(n²)，空间复杂度是O(1)。
