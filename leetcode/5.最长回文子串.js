/*
 * @lc app=leetcode.cn id=5 lang=javascript
 *
 * [5] 最长回文子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  if (s.length < 2) return s;
  let start = 0,
    maxLength = 1;

  // 从中心向两边扩展检查回文
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      // 如果找到更长的回文串，更新起始位置和最大长度
      if (right - left + 1 > maxLength) {
        start = left;
        maxLength = right - left + 1;
      }
      left++;
      right--;
    }
  }

  // 遍历每个可能的中心点
  for (let i = 0; i < s.length; i++) {
    // 检查奇数长度的回文串
    expandAroundCenter(i, i);

    // 检查偶数长度的回文串
    expandAroundCenter(i, i + 1);
  }
  return s.substring(start, start + maxLength);
};
// @lc code=end

// 这道最长回文子串的题目可以使用中心扩展法来解决，这是一个比较直观且高效的解法。如上代码。

// 解题思路说明：

// 1. 特殊情况处理：如果字符串长度小于2，直接返回原字符串。

// 2. 使用中心扩展法，对于每个位置，考虑两种情况：
//    - 以当前字符为中心的奇数长度回文串
//    - 以当前字符和下一个字符之间的空隙为中心的偶数长度回文串

// 3. expandAroundCenter 函数的作用：
//    - 接收左右指针作为参数
//    - 向两边扩展，直到不满足回文条件
//    - 如果找到更长的回文串，更新全局的起始位置和最大长度

// 4. 最后返回找到的最长回文子串。

// 时间复杂度：O(n²)，其中 n 是字符串的长度。
// 空间复杂度：O(1)，只使用了常数个变量。

// 举例说明：
// - 输入：s = "babad"
// - 输出："bab"（注意："aba" 也是有效答案）
// - 过程：
//   1. 遍历每个字符作为中心点
//   2. 对每个中心点，分别检查奇数和偶数长度的回文可能
//   3. 记录并更新最长的回文子串

// 这个解法的优点是实现简单，容易理解，且不需要额外的空间。虽然还有其他解法（如 Manacher 算法）的时间复杂度更优，但是中心扩展法在大多数情况下已经足够高效。
