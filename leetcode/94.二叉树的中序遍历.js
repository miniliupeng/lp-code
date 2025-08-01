/*
 * @lc app=leetcode.cn id=94 lang=javascript
 *
 * [94] 二叉树的中序遍历
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
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    const result = [];
    
    const inorder = (node) => {
        if (!node) return;
        
        // 左子树
        inorder(node.left);
        // 根节点
        result.push(node.val);
        // 右子树
        inorder(node.right);
    };
    
    inorder(root);
    return result;
};
// @lc code=end

// 时间复杂度是O(n)，空间复杂度也是O(h)，其中h为树的高度

// 深度优先遍历（DFS）：
// 先序遍历 Preorder  根节点 -> 左子树 -> 右子树
// 中序遍历 Inorder 左子树 -> 根节点 -> 右子树
// 后序遍历 Postorder 左子树 -> 右子树 -> 根节点

// 广度优先遍历（BFS）：
// 层序遍历 Level Order  按照层级从上到下，每层从左到右