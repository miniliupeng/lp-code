/*
 * @lc app=leetcode.cn id=79 lang=javascript
 *
 * [79] 单词搜索
 */

// @lc code=start
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
  const rows = board.length;
  const cols = board[0].length;

  // 从矩阵的每个位置开始尝试搜索
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (dfs(i, j, 0)) {
        return true;
      }
    }
  }

  return false;

  // 深度优先搜索函数
  function dfs(i, j, index) {
    // 已找到完整单词
    if (index === word.length) {
      return true;
    }

    // 边界检查
    if (i < 0 || i >= rows || j < 0 || j >= cols || board[i][j] !== word[index]) {
      return false;
    }

    // 记录当前字符并标记为已访问
    const temp = board[i][j];
    board[i][j] = '#'; // 使用特殊字符标记已访问

    // 向四个方向继续搜索
    const found =
      dfs(i + 1, j, index + 1) || dfs(i - 1, j, index + 1) || dfs(i, j + 1, index + 1) || dfs(i, j - 1, index + 1);

    // 恢复当前字符
    board[i][j] = temp;

    return found;
  }
};
// @lc code=end

// 算法思路：

// 1. 首先检查输入矩阵是否为空
// 2. 从矩阵的每个位置开始尝试搜索目标单词
// 3. 使用深度优先搜索（DFS）递归查找：
//    - 检查当前位置是否符合条件（边界内且字符匹配）
//    - 临时标记已访问过的位置，避免重复使用
//    - 向四个方向（上、下、左、右）继续搜索
//    - 回溯时恢复原始状态

// 时间复杂度：O(M × N × 4^L)，其中M和N是矩阵的行数和列数，L是单词长度，因为每个位置都有4个可能的搜索方向。
// 空间复杂度：O(L)，递归调用栈的深度取决于单词长度。
