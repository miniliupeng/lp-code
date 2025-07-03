/*
 * @lc app=leetcode.cn id=131 lang=javascript
 *
 * [131] 分割回文串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function (s) {
  const result = [];
  const path = [];

  // 判断字符串是否为回文串
  function isPalindrome(str, start, end) {
    while (start < end) {
      if (str[start] !== str[end]) {
        return false;
      }
      start++;
      end--;
    }
    return true;
  }

  // 回溯函数
  function backtrack(startIndex) {
    // 如果起始位置已经大于等于字符串长度，说明已经处理完整个字符串
    if (startIndex >= s.length) {
      result.push([...path]);
      return;
    }

    // 尝试从startIndex开始，将剩余部分切割成回文子串
    for (let i = startIndex; i < s.length; i++) {
      // 如果从startIndex到i的子串是回文串，则加入路径
      if (isPalindrome(s, startIndex, i)) {
        path.push(s.substring(startIndex, i + 1));
        // 递归处理剩余部分
        backtrack(i + 1);
        // 回溯，移除最后一个子串
        path.pop();
      }
    }
  }

  backtrack(0);
  return result;
};
// @lc code=end

// 核心思想：
// 1. 使用回溯算法，从字符串起始位置开始尝试分割
// 2. 对于每个可能的分割点，检查当前子串是否为回文串
// 3. 如果是回文串，将其加入路径，并递归处理剩余部分
// 4. 当处理完整个字符串时，将当前路径添加到结果中

// 具体实现：
// 1. 定义了辅助函数`isPalindrome`用于判断子串是否为回文串
// 2. 使用`backtrack`函数进行回溯，尝试所有可能的分割方案
// 3. 当找到一个有效的分割方案时，将其添加到结果数组中

// 时间复杂度为O(n·2^n)，其中n为字符串长度，因为每个位置都有"切割"或"不切割"两种选择。