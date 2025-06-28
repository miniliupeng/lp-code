/*
 * @lc app=leetcode.cn id=25 lang=javascript
 *
 * [25] K 个一组翻转链表
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
 * @param {number} k
 * @return {ListNode}
 */

// dismiss
var reverseKGroup = function (head, k) {
  // 1. 先看看是否有k个节点
  let check = head;
  for (let i = 0; i < k; i++) {
    if (!check) return head; // 不足k个就不翻转
    check = check.next;
  }

  // 2. 翻转k个节点（基本链表翻转）
  let prev = null;
  let curr = head;
  for (let i = 0; i < k; i++) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  // 3. 递归处理后续节点
  // 4. 连接：head是翻转前的头，翻转后变成尾
  head.next = reverseKGroup(curr, k);

  return prev; // prev是翻转后的头
};
// @lc code=end
