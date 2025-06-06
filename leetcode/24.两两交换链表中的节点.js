/*
 * @lc app=leetcode.cn id=24 lang=javascript
 *
 * [24] 两两交换链表中的节点
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
var swapPairs = function(head) {
    // 基本情况：链表为空或只有一个节点，无需交换
    if (!head || !head.next) return head;
    
    // 记录第二个节点，它将成为新的头节点
    const newHead = head.next;
    
    // 第一个节点连接到后续交换完成的子链表
    head.next = swapPairs(newHead.next);
    
    // 第二个节点连接到第一个节点
    newHead.next = head;
    
    // 返回新的头节点
    return newHead;
};
// @lc code=end

// 解题思路：
// 1. 采用递归解法，每次处理两个节点的交换
// 2. 递归基本情况是链表为空或只有一个节点，此时直接返回
// 3. 在每一层递归中：
//    - 将当前头节点的下一个节点作为新的头节点
//    - 当前头节点指向递归处理剩余部分得到的结果
//    - 新头节点指向原头节点，完成交换
// 时间复杂度：O(n)，需要遍历整个链表
// 空间复杂度：O(n/2)，递归调用栈的深度为链表长度的一半

