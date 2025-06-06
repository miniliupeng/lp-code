/*
 * @lc app=leetcode.cn id=138 lang=javascript
 *
 * [138] 随机链表的复制
 */

// @lc code=start
/**
 * // Definition for a _Node.
 * function _Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {_Node} head
 * @return {_Node}
 */
var copyRandomList = function (head) {
  // 处理空链表
  if (!head) return null;

  // 创建哈希表，建立原节点到新节点的映射
  const map = new Map();

  // 第一次遍历：创建所有新节点
  let curr = head;
  while (curr) {
    map.set(curr, new Node(curr.val));
    curr = curr.next;
  }

  // 第二次遍历：连接next和random指针
  curr = head;
  while (curr) {
    map.get(curr).next = map.get(curr.next) || null;
    map.get(curr).random = map.get(curr.random) || null;
    curr = curr.next;
  }

  return map.get(head);
};
// @lc code=end

// 解题思路：
// 1. 用哈希表记录"原节点→新节点"的映射关系
// 2. 先复制所有节点的值
// 3. 再设置所有新节点的next和random指针
// 4. 返回新链表的头节点
