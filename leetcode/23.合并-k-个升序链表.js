/*
 * @lc app=leetcode.cn id=23 lang=javascript
 *
 * [23] 合并 K 个升序链表
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
 * @param {ListNode[]} lists
 * @return {ListNode}
 */

var mergeKLists = function (lists) {
  const list = [];
  for (let i = 0; i < lists.length; i++) {
    let head = lists[i];
    while (head) {
      list.push(head.val);
      head = head.next;
    }
  }
  list.sort((a, b) => a- b);
  const res = new ListNode();
  let now = res;
  for (let i = 0; i < list.length; i++) {
    now.next = new ListNode(list[i]);
    now = now.next;
  }
  return res.next;
};
// @lc code=end
