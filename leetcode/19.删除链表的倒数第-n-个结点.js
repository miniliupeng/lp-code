/*
 * @lc app=leetcode.cn id=19 lang=javascript
 *
 * [19] 删除链表的倒数第 N 个结点
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
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
  // 创建虚拟头节点，在前端常用于处理边界情况
  const dummy = new ListNode();
  dummy.next = head;

  // 使用双指针技巧，类似前端中的滑动窗口
  let fast = dummy;
  let slow = dummy;

  // 第一步：fast指针先走n步
  for (let i = 0; i < n; i++) {
    fast = fast.next;
  }

  // 第二步：两个指针同时移动
  while (fast.next !== null) {
    fast = fast.next;
    slow = slow.next;
  }

  // 删除目标节点
  slow.next = slow.next.next;

  return dummy.next;
};
// @lc code=end
