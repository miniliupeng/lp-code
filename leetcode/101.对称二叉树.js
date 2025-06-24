/*
 * @lc app=leetcode.cn id=101 lang=javascript
 *
 * [101] 对称二叉树
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
 * @return {boolean}
 */
var isSymmetric = function (root) {
  // 辅助函数检查两个节点是否对称
  function isMirror(left, right) {
    // 两个节点都为空，对称
    if (!left && !right) return true;
    // 其中一个为空，另一个不为空，不对称
    if (!left || !right) return false;
    // 节点值不同，不对称
    if (left.val !== right.val) return false;

    // 递归检查：left的左子树和right的右子树对称 && left的右子树和right的左子树对称
    return isMirror(left.left, right.right) && isMirror(left.right, right.left);
  }

  // 从根节点的左右子树开始比较
  return isMirror(root.left, root.right);
};
// @lc code=end
