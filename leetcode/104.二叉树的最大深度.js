/*
 * @lc app=leetcode.cn id=104 lang=javascript
 *
 * [104] 二叉树的最大深度
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
 * @return {number}
 */
var maxDepth = function(root) {
    // 如果节点为空，深度为0
    if (root === null) return 0;
    
    // 返回1（当前节点）加上左右子树中较深的那个
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};
// @lc code=end

