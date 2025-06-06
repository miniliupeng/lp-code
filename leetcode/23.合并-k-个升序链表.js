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
  if (!lists || lists.length === 0) return null;

  // 合并两个有序链表的辅助函数
  const mergeTwoLists = (l1, l2) => {
    const dummy = new ListNode(0);
    let current = dummy;

    while (l1 && l2) {
      if (l1.val <= l2.val) {
        current.next = l1;
        l1 = l1.next;
      } else {
        current.next = l2;
        l2 = l2.next;
      }
      current = current.next;
    }

    current.next = l1 || l2;
    return dummy.next;
  };

  // 使用分治法合并链表
  const merge = (lists, start, end) => {
    if (start === end) return lists[start];
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const left = merge(lists, start, mid);
    const right = merge(lists, mid + 1, end);
    return mergeTwoLists(left, right);
  };

  return merge(lists, 0, lists.length - 1);
};
// @lc code=end

// 这个解决方案的主要思路是：

// 1. 首先处理边界情况：如果输入为空或长度为0，返回null。

// 2. 实现了一个`mergeTwoLists`辅助函数来合并两个有序链表。

// 3. 使用分治法（递归）来将问题分解：
//    - 将链表数组分成两半
//    - 递归地合并左半部分和右半部分
//    - 最后合并得到的两个有序链表

// 时间复杂度为O(N * log k)，其中N是所有节点的总数，k是链表的个数。空间复杂度为O(log k)，主要是递归调用栈的开销。

// 这种方法比直接顺序合并更有效率，因为每次合并的链表长度都比较均匀，避免了链表长度差异过大的情况。




// var mergeKLists = function(lists) {
//   // 收集所有节点值
//   const values = [];
//   for (let list of lists) {
//       let current = list;
//       while (current) {
//           values.push(current.val);
//           current = current.next;
//       }
//   }
  
//   // 排序
//   values.sort((a, b) => a - b);
  
//   // 重建链表
//   const dummy = new ListNode(0);
//   let current = dummy;
//   for (let val of values) {
//       current.next = new ListNode(val);
//       current = current.next;
//   }
  
//   return dummy.next;
// };
