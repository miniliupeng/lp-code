/*
 * @lc app=leetcode.cn id=543 lang=javascript
 *
 * [543] 二叉树的直径
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
var diameterOfBinaryTree = function(root) {
    let maxDiameter = 0;
    
    // 定义深度优先搜索函数
    function dfs(node) {
        // 如果节点为空，深度为0
        if (!node) return 0;
        
        // 计算左子树的深度
        const leftDepth = dfs(node.left);
        // 计算右子树的深度
        const rightDepth = dfs(node.right);
        
        // 更新最大直径
        // 当前节点的直径 = 左子树深度 + 右子树深度
        maxDiameter = Math.max(maxDiameter, leftDepth + rightDepth);
        
        // 返回当前节点的深度
        // 当前节点的深度 = max(左子树深度, 右子树深度) + 1
        return Math.max(leftDepth, rightDepth) + 1;
    }
    
    dfs(root);
    return maxDiameter;
};
// @lc code=end

// 二叉树的直径是指树中任意两个节点之间的最长路径长度。这里的实现采用深度优先搜索(DFS)策略：

// 1. 使用全局变量 `maxDiameter` 记录最大直径
// 2. 对每个节点：
//    - 计算左子树最大深度
//    - 计算右子树最大深度
//    - 更新最大直径（左子树深度 + 右子树深度）
//    - 返回当前节点的最大深度（左右子树深度的最大值 + 1）

// 算法时间复杂度为 O(n)，其中 n 是树中节点数量，因为每个节点只访问一次。空间复杂度为 O(h)，h 是树的高度，主要是递归调用栈的开销。