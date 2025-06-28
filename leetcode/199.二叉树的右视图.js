/*
 * @lc app=leetcode.cn id=199 lang=javascript
 *
 * [199] 二叉树的右视图
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
var rightSideView = function(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const size = queue.length;
        
        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            
            // 如果是当前层的最后一个节点
            if (i === size - 1) {
                result.push(node.val);
            }
            
            // 先将左子节点加入队列
            if (node.left) queue.push(node.left);
            // 再将右子节点加入队列
            if (node.right) queue.push(node.right);
        }
    }
    
    return result;
};
// @lc code=end

