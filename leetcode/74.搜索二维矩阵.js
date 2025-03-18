/*
 * @lc app=leetcode.cn id=74 lang=javascript
 *
 * [74] 搜索二维矩阵
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) return false

  const m = matrix.length
  const n = matrix[0].length

  let left = 0
  let right = m * n -1

  while (left <= right) {
    const mid = Math.floor((right + left)/ 2)  // 建议69题写法，可能出现数值溢出问题

    const row = Math.floor(mid / n)
    const col = mid % n

    if (matrix[row][col]  === target) {
      return true
    } else if (matrix[row][col] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return false
};
// @lc code=end
