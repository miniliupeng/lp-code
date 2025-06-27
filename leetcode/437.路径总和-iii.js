/*
 * @lc app=leetcode.cn id=437 lang=javascript
 *
 * [437] 路径总和 III
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function (root, targetSum) {
  // 如果根节点为空，返回0
  if (!root) return 0;

  // 路径总数 = 以当前节点为起点的路径数 + 左子树中的路径数 + 右子树中的路径数
  return findPath(root, targetSum) + pathSum(root.left, targetSum) + pathSum(root.right, targetSum);
};

/**
 * 计算以某个节点为起点，满足路径和为targetSum的路径数量
 * @param {TreeNode} node 当前节点
 * @param {number} targetSum 目标和
 * @return {number} 路径数量
 */
function findPath(node, targetSum) {
  // 如果节点为空，返回0
  if (!node) return 0;

  // 计数器，记录满足条件的路径数量
  let count = 0;

  // 如果当前节点值等于目标和，找到一条路径
  if (node.val === targetSum) {
    count++;
  }

  // 继续向下搜索，注意目标和需要减去当前节点值
  count += findPath(node.left, targetSum - node.val);
  count += findPath(node.right, targetSum - node.val);

  return count;
}
// @lc code=end
