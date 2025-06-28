/*
 * @lc app=leetcode.cn id=994 lang=javascript
 *
 * [994] 腐烂的橘子
 */

// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function (grid) {
  const m = grid.length;
  const n = grid[0].length;
  let queue = [];
  let fresh = 0;
  let time = 0;

  // 找出腐烂橘子和统计新鲜橘子
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === 2) queue.push([i, j]);
      if (grid[i][j] === 1) fresh++;
    }
  }

  // 如果没有新鲜橘子，直接返回0
  if (fresh === 0) return 0;

  // 四个方向：上右下左
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
  ];

  // BFS传播腐烂
  while (queue.length && fresh > 0) {
    let size = queue.length;

    // 处理当前层的所有腐烂橘子
    for (let i = 0; i < size; i++) {
      let [x, y] = queue.shift();

      // 检查四个方向
      for (let [dx, dy] of dirs) {
        let nx = x + dx;
        let ny = y + dy;

        // 如果是新鲜橘子，让它腐烂
        if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] === 1) {
          grid[nx][ny] = 2;
          fresh--;
          queue.push([nx, ny]);
        }
      }
    }

    // 每次扩散一层，时间+1
    if (queue.length > 0) time++;
  }

  // 如果还有新鲜橘子，返回-1
  return fresh === 0 ? time : -1;
};
// @lc code=end
