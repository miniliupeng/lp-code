/*
 * @lc app=leetcode.cn id=230 lang=javascript
 *
 * [230] 二叉搜索树中第 K 小的元素
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
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (root, k) {
  let count = 0; // 计数器，记录当前访问的是第几个节点
  let result = null; // 存储结果

  // 定义中序遍历函数
  const inorder = (node) => {
    if (!node || result !== null) return; // 如果节点为空或已找到结果，则返回

    // 先遍历左子树
    inorder(node.left);

    // 访问当前节点
    count++; // 计数加1
    if (count === k) {
      // 如果是第k个节点
      result = node.val; // 记录结果
      return;
    }

    // 再遍历右子树
    inorder(node.right);
  };

  inorder(root); // 开始遍历
  return result; // 返回第k小的元素
};
// @lc code=end

// ## 解题思路

// 二叉搜索树有一个重要特性：**中序遍历**（左->根->右）会产生一个**升序**的元素序列。利用这一特性，我们只需要：

// 1. 对BST进行中序遍历
// 2. 在遍历过程中计数，当访问到第k个节点时，记录其值并返回

// ## 算法复杂度

// - **时间复杂度**：O(n)，其中n是树中的节点数。在最坏情况下，我们需要访问所有节点。
// - **空间复杂度**：O(h)，其中h是树的高度。这是由于递归调用栈的开销，最坏情况下为O(n)。

// ## 优化思路

// 如果这个树经常需要查询第k小的元素，我们可以在每个节点维护其左子树的节点数量，这样可以在O(h)时间内找到第k小的元素。
