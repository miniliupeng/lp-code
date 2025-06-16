/*
 * @lc app=leetcode.cn id=226 lang=javascript
 *
 * [226] 翻转二叉树
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
 * @return {TreeNode}
 */
var invertTree = function(root) {
    // 如果根节点为空，直接返回null
    if (root === null) return null;
    
    // 交换左右子节点
    const temp = root.left;
    root.left = root.right;
    root.right = temp;
    
    // 递归翻转左右子树
    invertTree(root.left);
    invertTree(root.right);
    
    // 返回翻转后的根节点
    return root;
};
// @lc code=end

