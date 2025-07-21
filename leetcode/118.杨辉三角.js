/*
 * @lc app=leetcode.cn id=118 lang=javascript
 *
 * [118] 杨辉三角
 */

// @lc code=start
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function (numRows) {
  const result = [];

  for (let i = 0; i < numRows; i++) {
    // 每行创建一个数组
    const row = [];

    for (let j = 0; j <= i; j++) {
      // 每行的第一个和最后一个元素都是1
      if (j === 0 || j === i) {
        row.push(1);
      } else {
        // 其他位置的元素是上一行的相邻两个元素之和
        row.push(result[i - 1][j - 1] + result[i - 1][j]);
      }
    }

    result.push(row);
  }

  return result;
};
// @lc code=end

// 杨辉三角的规律：
// 1. 每行的第一个和最后一个数字都是1
// 2. 其他位置的数字等于它上一行的左上方和右上方两个数字之和

// 算法思路如下：

// 1. 创建一个空数组 `result` 存储最终结果
// 2. 遍历每一行（从0到numRows-1）
// 3. 对每一行：
//    - 创建新的行数组
//    - 遍历该行的每个位置（从0到当前行索引i）
//    - 如果是行首或行尾，值为1
//    - 否则，值等于上一行相邻两个数的和：`result[i-1][j-1] + result[i-1][j]`
//    - 将新行添加到结果数组

// 这个算法的时间复杂度为O(numRows²)，空间复杂度为O(numRows²)。
