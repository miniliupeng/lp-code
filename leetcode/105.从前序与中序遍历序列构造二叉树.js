/*
 * @lc app=leetcode.cn id=105 lang=javascript
 *
 * [105] 从前序与中序遍历序列构造二叉树
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
  if (preorder.length === 0 || inorder.length === 0) return null;

  // 前序遍历的第一个元素是根节点
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);

  // 在中序遍历中找到根节点的位置，确定左右子树的划分
  const rootIndex = inorder.indexOf(rootVal);

  // 分割左右子树的前序和中序遍历序列
  // 左子树的前序遍历：preorder中根节点后的rootIndex个元素
  const leftPreorder = preorder.slice(1, rootIndex + 1);
  // 左子树的中序遍历：inorder中根节点前的所有元素
  const leftInorder = inorder.slice(0, rootIndex);

  // 右子树的前序遍历：preorder中剩余的元素
  const rightPreorder = preorder.slice(rootIndex + 1);
  // 右子树的中序遍历：inorder中根节点后的所有元素
  const rightInorder = inorder.slice(rootIndex + 1);

  // 递归构建左右子树
  root.left = buildTree(leftPreorder, leftInorder);
  root.right = buildTree(rightPreorder, rightInorder);

  return root;
};
// @lc code=end
