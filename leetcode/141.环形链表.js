/*
 * @lc app=leetcode.cn id=141 lang=javascript
 *
 * [141] 环形链表
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
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    if (!head || !head.next) return false;
    
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    
    return false;
};
// @lc code=end




// ## 环形链表解题思路

// 使用了经典的快慢指针（Floyd's龟兔赛跑算法）来解决这个问题：

// 1. 如果链表为空或只有一个节点，则不可能有环，直接返回false
// 2. 设置两个指针slow和fast，初始都指向头结点
// 3. slow每次走一步，fast每次走两步
// 4. 如果链表中有环，两个指针最终会在环中相遇（即指向同一节点）
// 5. 如果链表中没有环，fast最终会到达链表末尾（null）

// 这个算法时间复杂度为O(n)，空间复杂度为O(1)，是一个非常高效且代码简洁的解法。