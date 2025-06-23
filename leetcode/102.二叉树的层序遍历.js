/*
 * @lc app=leetcode.cn id=102 lang=javascript
 *
 * [102] 二叉树的层序遍历
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
 * @return {number[][]}
 */
var levelOrder = function (root) {
  // if (!root) return [];

  // const result = [];
  // const queue = [root];

  // while (queue.length) {
  //     const levelSize = queue.length;
  //     const currentLevel = [];

  //     for (let i = 0; i < levelSize; i++) {
  //         const node = queue.shift();
  //         currentLevel.push(node.val);

  //         if (node.left) {
  //             queue.push(node.left);
  //         }

  //         if (node.right) {
  //             queue.push(node.right);
  //         }
  //     }

  //     result.push(currentLevel);
  // }

  // return result;

  // 简便方法：递归实现
  /*
    if (!root) return [];
    
    const result = [];
    
    const traverseLevel = (node, level) => {
        if (!node) return;
        
        // 如果result还没有这一层的数组，创建一个新数组
        if (result.length === level) {
            result.push([]);
        }
        
        // 将当前节点值加入对应层的数组
        result[level].push(node.val);
        
        // 递归处理左右子节点，层级+1
        traverseLevel(node.left, level + 1);
        traverseLevel(node.right, level + 1);
    };
    
    traverseLevel(root, 0);
    return result;
    */

  // 简写方法（使用队列 + 解构）
  if (!root) return [];
  let queue = [root],
    res = [];
  while (queue.length) {
    let level = [],
      nextQueue = [];
    for (let node of queue) {
      level.push(node.val);
      node.left && nextQueue.push(node.left);
      node.right && nextQueue.push(node.right);
    }
    res.push(level);
    queue = nextQueue;
  }
  return res;
};
// @lc code=end

// 三种方法的时间复杂度都是 O(n)
