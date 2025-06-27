/*
 * @lc app=leetcode.cn id=114 lang=javascript
 *
 * [114] 二叉树展开为链表
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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function (root) {
  // 创建数组存储前序遍历结果
  const list = [];
  // 执行前序遍历，将所有节点按顺序存入数组
  preorderTraversal(root, list);
  const size = list.length;
  // 遍历数组，将每个节点与下一个节点连接
  for (let i = 1; i < size; i++) {
    const prev = list[i - 1],
      curr = list[i];
    // 将前一个节点的左子节点置为null
    prev.left = null;
    // 将前一个节点的右子节点指向当前节点，形成链表结构
    prev.right = curr;
  }
};

/**
 * 前序遍历辅助函数
 * @param {TreeNode} root - 当前节点
 * @param {Array} list - 存储遍历结果的数组
 */
const preorderTraversal = (root, list) => {
  if (root != null) {
    // 前序遍历顺序：根->左->右
    list.push(root);
    preorderTraversal(root.left, list);
    preorderTraversal(root.right, list);
  }
};

// @lc code=end
