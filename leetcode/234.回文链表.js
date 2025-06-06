/*
 * @lc app=leetcode.cn id=234 lang=javascript
 *
 * [234] 回文链表
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
 * @return {boolean}
 */
var isPalindrome = function (head) {
  const values = [];

  // 将所有节点值存入数组
  while (head) {
    values.push(head.val);
    head = head.next;
  }

  // 检查数组是否为回文
  for (let i = 0, j = values.length - 1; i < j; i++, j--) {
    if (values[i] !== values[j]) return false;
  }

  return true;
};
// @lc code=end



// ## 解法说明

// 1. 我们首先把链表所有节点值存入数组中
// 2. 然后使用双指针（一个从头开始，一个从尾开始）来判断数组是否回文
// 3. 如果发现任何不匹配的值，立即返回false
// 4. 否则返回true

// 时间复杂度依然是O(n)，但空间复杂度变为O(n)，因为我们需要一个额外的数组来存储所有节点值。
