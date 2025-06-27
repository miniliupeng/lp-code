/*
 * @lc app=leetcode.cn id=236 lang=javascript
 *
 * [236] 二叉树的最近公共祖先
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  // 基础情况：如果节点为空或者节点就是p或q，直接返回该节点
  if (!root || root === p || root === q) return root;

  // 分别在左右子树中寻找p或q
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // 如果左右子树都找到了节点，说明当前root就是最近公共祖先
  if (left && right) return root;

  // 如果只有左子树找到了，返回左子树的结果
  // 如果只有右子树找到了，返回右子树的结果
  return left || right
};
// @lc code=end
