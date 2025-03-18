/*
 * @lc app=leetcode.cn id=206 lang=javascript
 *
 * [206] 反转链表
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
var reverseList = function (head) {
  let prev = null; // 前一个节点，初始为 null
  let current = head; // 当前节点，初始为头节点

  while (current) {
    const next = current.next; // 1. 暂存下一个节点
    current.next = prev; // 2. 反转指针
    prev = current; // 3. 向前移动 prev 指针
    current = next; // 4. 向后移动 current 指针
  }

  return prev; // prev 最终指向新的头节点
};
// @lc code=end
