/*
 * @lc app=leetcode.cn id=2 lang=javascript
 *
 * [2] 两数相加
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
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  // 创建虚拟头节点
  const dummy = new ListNode(0);
  let current = dummy;
  // 声明进位值
  let carry = 0;

  // 当l1或l2还有节点，或者还有进位时，继续循环
  while (l1 || l2 || carry) {
    // 获取当前节点的值，如果节点为空则取0
    const val1 = l1 ? l1.val : 0;
    const val2 = l2 ? l2.val : 0;

    // 计算和与进位
    const sum = val1 + val2 + carry;
    carry = Math.floor(sum / 10);

    // 计算当前位的值
    current.next = new ListNode(sum % 10);
    current = current.next;
    
    // 移动指针
    l1 = l1 ? l1.next : null;
    l2 = l2 ? l2.next : null;
  }
  return dummy.next
};
// @lc code=end

// 解题思路说明：

// 1. 创建一个虚拟头节点（dummy node）来简化链表操作。

// 2. 使用变量 carry 记录进位值。

// 3. 遍历两个链表，当两个链表都还有节点或者还有进位时继续循环：
//    - 获取当前节点的值（如果节点为空则取0）
//    - 计算当前位的和（包括进位）
//    - 计算新的进位值
//    - 创建新节点，其值为和的个位数
//    - 移动指针到下一个节点

// 4. 最后返回 dummy.next 作为结果链表的头节点。

// 时间复杂度：O(max(n, m))，其中 n 和 m 是两个链表的长度。
// 空间复杂度：O(max(n, m))，需要创建一个新的链表来存储结果。

// 举例说明：
// - 输入：l1 = [2,4,3], l2 = [5,6,4]
// - 输出：[7,0,8]
// - 解释：342 + 465 = 807
