/*
 * @lc app=leetcode.cn id=200 lang=javascript
 *
 * [200] 岛屿数量
 */

// @lc code=start
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  // DFS函数，用于探索与当前陆地相连的所有陆地
  function dfs(i, j) {
    // 如果坐标越界或者当前位置不是陆地，直接返回
    if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] !== '1') {
      return;
    }

    // 将当前位置标记为已访问（避免重复访问）
    grid[i][j] = '2';

    // 探索四个方向
    dfs(i - 1, j); // 上
    dfs(i + 1, j); // 下
    dfs(i, j - 1); // 左
    dfs(i, j + 1); // 右
  }

  // 遍历整个网格
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // 如果找到一个陆地，开始DFS
      if (grid[i][j] === '1') {
        count++; // 岛屿数量加1
        dfs(i, j); // 将与当前陆地相连的所有陆地都标记为已访问
      }
    }
  }

  return count;
};
// @lc code=end
