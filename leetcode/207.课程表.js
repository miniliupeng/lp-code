/*
 * @lc app=leetcode.cn id=207 lang=javascript
 *
 * [207] 课程表
 */

// @lc code=start
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function (numCourses, prerequisites) {
  // 构建邻接表：pre -> [dependent courses]
  const graph = Array(numCourses)
    .fill()
    .map(() => []);
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
  }

  // 节点访问状态：未访问(0)、正在访问(1)、已完成访问(2)
  const status = Array(numCourses).fill(0);

  // DFS检测是否存在环，返回true表示有环（无法完成）
  function hasCycle(index) {
    if (status[index] === 1) return true; // 发现环
    if (status[index] === 2) return false; // 已检查过，无环

    status[index] = 1; // 标记为正在访问

    // 检查所有依赖此课程的后续课程
    for (const dep of graph[index]) {
      if (hasCycle(dep)) {
        return true; // 发现环
      }
    }

    status[index] = 2; // 标记为已完成访问
    return false; // 此路径无环
  }

  // 检查所有课程是否都能完成
  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) {
      return false; // 发现环，无法完成所有课程
    }
  }

  return true; // 所有课程都能完成
};
// @lc code=end

/*
算法思路：DFS + 三色标记法检测环
1. 构建有向图的邻接表
2. 使用三种状态标记节点：0(未访问)、1(正在访问)、2(已访问)
3. DFS遍历：
 - 如果遇到状态为1的节点，说明存在环，返回false
 - 如果遇到状态为2的节点，说明已处理过，直接返回true
 - 将当前节点标记为1，递归访问所有邻接节点
 - 访问完成后将节点标记为2
4. 对所有未访问的节点进行DFS

相比BFS方法的优势：
- 代码更简洁，不需要维护入度数组和队列
- 空间复杂度更优，只需要一个状态数组

时间复杂度：O(V + E)
空间复杂度：O(V)

测试用例：
canFinish(2, [[1,0]]) = true  
canFinish(2, [[1,0],[0,1]]) = false  // 检测到环
*/
canFinish(2, [[1, 0]]);
