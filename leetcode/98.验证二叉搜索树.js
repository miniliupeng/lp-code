/*
 * @lc app=leetcode.cn id=98 lang=javascript
 *
 * [98] 验证二叉搜索树
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
var isValidBST = function (root) {
  // 辅助函数，检查节点值是否在范围内
  function isValid(node, min, max) {
    // 空节点是有效的BST
    if (!node) return true;

    // 检查当前节点值是否在范围内
    if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
      return false;
    }

    // 检查左子树（必须小于当前节点值）
    // 检查右子树（必须大于当前节点值）
    return isValid(node.left, min, node.val) && isValid(node.right, node.val, max);
  }

  // 从无边界开始验证
  return isValid(root, null, null);
};
// @lc code=end

// 有效 二叉搜索树定义如下：

// 节点的左子树只包含 小于 当前节点的数。
// 节点的右子树只包含 大于 当前节点的数。
// 所有左子树和右子树自身必须也是二叉搜索树。

// 该实现使用递归方法验证二叉搜索树，主要思路是为每个节点定义有效的值范围：

// 1. 空节点视为有效的BST
// 2. 对于每个节点，检查其值是否在允许的范围内
// 3. 对于左子树中的节点，其值必须小于父节点的值
// 4. 对于右子树中的节点，其值必须大于父节点的值
// 5. 随着树的深入，我们不断缩小每个子树的有效范围

// 时间复杂度：O(n)，其中n是节点数量，因为我们需要访问每个节点一次
// 空间复杂度：O(h)，其中h是树的高度，这是由递归调用栈的深度决定的
