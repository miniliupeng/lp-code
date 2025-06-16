/*
 * @lc app=leetcode.cn id=438 lang=javascript
 *
 * [438] 找到字符串中所有字母异位词
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
// dismiss
var findAnagrams = function (s, p) {
  const res = [],
    count = Array(26).fill(0); // 结果数组和字符频率计数数组
  for (let c of p) count[c.charCodeAt(0) - 97]++; // 统计模式串p中每个字符的出现频率
  let l = 0,
    r = 0,
    need = p.length; // 左右指针和需要匹配的字符数
  while (r < s.length) {
    // 滑动窗口
    if (count[s.charCodeAt(r++) - 97]-- > 0) need--; // 如果当前字符在p中存在,need减1
    if (need === 0) res.push(l); // 当need为0时,找到一个异位词
    if (r - l === p.length && count[s.charCodeAt(l++) - 97]++ >= 0) need++; // 窗口满时移除左字符
  }
  return res; // 返回所有异位词起始位置
};
// var findAnagrams = function (s, p) {
//   const result = [];
//   if (s.length < p.length) return result;

//   // 创建两个计数器
//   const pCount = new Array(26).fill(0);
//   const sCount = new Array(26).fill(0);

//   // 计算模式串p中每个字符的频率
//   for (let i = 0; i < p.length; i++) {
//     pCount[p.charCodeAt(i) - 'a'.charCodeAt(0)]++;
//   }

//   // 滑动窗口
//   for (let i = 0; i < s.length; i++) {
//     // 添加新字符到滑动窗口
//     sCount[s.charCodeAt(i) - 'a'.charCodeAt(0)]++;

//     // 如果窗口大小超过p的长度，移除最早的字符
//     if (i >= p.length) {
//       sCount[s.charCodeAt(i - p.length) - 'a'.charCodeAt(0)]--;
//     }

//     // 判断从i-p.length+1到i这个窗口内的字符频率是否与p相同
//     if (i >= p.length - 1 && arraysEqual(pCount, sCount)) {
//       result.push(i - p.length + 1);
//     }
//   }

//   return result;
// };

// // 辅助函数，判断两个数组是否相等
// function arraysEqual(arr1, arr2) {
//   for (let i = 0; i < arr1.length; i++) {
//     if (arr1[i] !== arr2[i]) return false;
//   }
//   return true;
// }

// ## 解题思路解释：

// 1. 使用滑动窗口技巧来处理这个问题
// 2. 创建两个计数数组，分别记录模式串p和当前窗口内的字符频率
// 3. 遍历字符串s，对于每个位置：
//    - 添加当前字符到窗口计数
//    - 如果窗口大小超过p的长度，移除最早的字符
//    - 判断当前窗口中的字符频率是否与p的字符频率相同
//    - 如果相同，则记录当前窗口的起始索引

// 这种方法的时间复杂度是O(n)，其中n是字符串s的长度，空间复杂度是O(1)，因为我们使用的计数数组大小是固定的。

// @lc code=end
