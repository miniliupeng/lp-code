/*
 * @lc app=leetcode.cn id=142 lang=javascript
 *
 * [142] 环形链表 II
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
 * @return {ListNode}
 */
var detectCycle = function(head) {
    if (!head || !head.next) return null;
    
    let slow = head;
    let fast = head;
    
    // 第一阶段：检测是否有环
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow === fast) {
            // 第二阶段：找环的入口
            slow = head;
            while (slow !== fast) {
                slow = slow.next;
                fast = fast.next;
            }
            return slow;
        }
    }
    
    return null;
};
// @lc code=end




// ## 环形链表II解题思路

// 这道题要求不仅判断链表是否有环，还要返回环的入口节点。我使用了Floyd算法的扩展版本：

// 1. 首先检测边界情况：空链表或只有一个节点的链表不可能有环
// 2. 设置快慢两个指针，都从头结点出发
// 3. 第一阶段：检测是否有环
//    - 慢指针每次走一步，快指针每次走两步
//    - 如果有环，两指针必定在环内相遇
//    - 如果无环，快指针会先到达链表末尾

// 4. 第二阶段：找到环的入口点
//    - 当两指针相遇后，将慢指针重置到头节点
//    - 两个指针都改为每次走一步
//    - 两指针再次相遇的点就是环的入口

// 这个算法基于以下数学性质：如果链表头部到环入口的距离为a，从环入口到相遇点的距离为b，那么从相遇点继续前进a步一定会到达环的入口点。

// 算法的时间复杂度为O(n)，空间复杂度为O(1)，保持了代码的简洁性和效率。
