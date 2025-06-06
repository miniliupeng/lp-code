/*
 * @lc app=leetcode.cn id=160 lang=javascript
 *
 * [160] 相交链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function (headA, headB) {
  let pA = headA;
  let pB = headB;

  // 当指针不相等时继续循环
  while (pA !== pB) {
    // 如果到达链表末尾，则切换到另一个链表的头部
    // 如果没有相交点，pA和pB最终都会变成null，循环结束
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }

  // 返回交点（如果没有交点，则为null）
  return pA;
};
// @lc code=end
