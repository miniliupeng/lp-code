/*
 * @lc app=leetcode.cn id=148 lang=javascript
 *
 * [148] 排序链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function (head) {
  // 空链表或单节点
  if (!head || !head.next) return head;

  // 提取值到数组
  const values = [];
  let curr = head;
  while (curr) {
    values.push(curr.val);
    curr = curr.next;
  }

  // 数组排序
  values.sort((a, b) => a - b);

  // 重建链表
  curr = head;
  for (let val of values) {
    curr.val = val;
    curr = curr.next;
  }

  return head;
};
// @lc code=end

// 解题思路：
// 1. 将链表节点值全部提取到数组中
// 2. 使用JavaScript内置排序
// 3. 按排序后的值更新原链表

// 复杂度：
// - 时间复杂度：O(n log n)，主要是数组排序的复杂度
// - 空间复杂度：O(n)，需要额外数组存储所有值

// 这种方法虽然不是最优的链表排序实现，但代码量最少且易于理解。
