/*
 * @lc app=leetcode.cn id=240 lang=javascript
 *
 * [240] 搜索二维矩阵 II
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // 从右上角开始搜索
  let row = 0;
  let col = cols - 1;
  
  while (row < rows && col >= 0) {
    const current = matrix[row][col];
    
    if (current === target) {
      return true;
    } else if (current > target) {
      // 当前值大于目标值，向左移动
      col--;
    } else {
      // 当前值小于目标值，向下移动
      row++;
    }
  }
  
  return false;
};
// @lc code=end

// 算法思路：
// 1. 从矩阵的右上角开始搜索
// 2. 如果当前元素等于目标值，返回true
// 3. 如果当前元素大于目标值，向左移动一列（因为右边的元素更大，不可能包含目标值）
// 4. 如果当前元素小于目标值，向下移动一行（因为上面的元素更小，不可能包含目标值）
// 5. 重复上述过程，直到找到目标值或超出矩阵边界

// 这种解法利用了矩阵"每行从左到右递增"和"每列从上到下递增"的特性，时间复杂度为O(m+n)，其中m和n分别是矩阵的行数和列数。空间复杂度为O(1)。

