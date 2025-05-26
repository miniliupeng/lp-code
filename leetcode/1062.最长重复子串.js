/*
 * @lc app=leetcode.cn id=1062 lang=javascript
 *
 * [1062] 最长重复子串
 */

// 给定字符串 s，找出最长重复子串的长度。如果不存在重复子串就返回 0。

// 示例 1：

// 输入："abcd"
// 输出：0
// 解释：没有重复子串。
// 示例 2：

// 输入："abbaba"
// 输出：2
// 解释：最长的重复子串为 "ab" 和 "ba"，每个出现 2 次。
// 示例 3：

// 输入："aabcaabdaab"
// 输出：3
// 解释：最长的重复子串为 "aab"，出现 3 次。

// 提示：

// 1 <= s.length <= 2000
// 字符串 s 仅包含从 'a' 到 'z' 的小写英文字母。

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */

var longestRepeatingSubstring = function (s) {
  const n = s.length;

  // 检查长度为len的子串是否有重复
  const search = (len) => {
    if (len === 0) return true;

    const seen = new Set();

    // 检查所有长度为len的子串
    for (let i = 0; i <= n - len; i++) {
      const substr = s.substring(i, i + len);
      if (seen.has(substr)) {
        return true; // 找到重复
      }
      seen.add(substr);
    }

    return false; // 没有找到重复
  };

  // 二分查找最长重复子串长度
  let left = 0;
  let right = n;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (search(mid)) {
      // 如果长度为mid的子串有重复，尝试更长的
      left = mid + 1;
    } else {
      // 否则尝试更短的
      right = mid;
    }
  }

  // 结果是最后一个返回true的长度
  return left - 1;
};
// @lc code=end


// # 最长重复子串解题思路

// 这道题使用二分查找解决，主要思路如下：

// 1. **问题定义**：找出字符串中最长的重复子串长度

// 2. **二分查找思路**：
//    - 如果存在长度为L的重复子串，那么一定存在长度为1到L-1的重复子串
//    - 如果不存在长度为L的重复子串，那么一定不存在长度大于L的重复子串
//    - 因此可以用二分查找确定最大长度

// 3. **算法步骤**：
//    - 定义`search(len)`函数检查是否存在长度为len的重复子串
//    - 用Set记录已见过的子串
//    - 使用二分查找，初始区间为[0, n]
//    - 当找到长度为mid的重复子串时，在[mid+1, right]中继续查找
//    - 当没找到长度为mid的重复子串时，在[left, mid-1]中查找
//    - 最终返回left-1，即最后一个返回true的长度

// 4. **时间复杂度**：O(n² log n)，其中n是字符串长度

// 这种方法高效地找到了最长重复子串的长度。


// console.log(longestRepeatingSubstring('abbaba'));
// console.log(longestRepeatingSubstring('aabcaabdaab'));