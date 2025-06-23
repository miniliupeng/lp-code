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
    // 解法一：递归方法
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
    
    // 解法二：迭代方法（使用栈）
    /* 
    const result = [];
    const stack = [];
    let current = root;
    
    while (current || stack.length > 0) {
        // 将所有左子节点入栈
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        // 弹出栈顶节点并访问
        current = stack.pop();
        result.push(current.val);
        
        // 处理右子节点
        current = current.right;
    }
    
    return result;
    */
};
// @lc code=end

// 且时间复杂度都是O(n)，空间复杂度也都是O(h)，其中h为树的高度