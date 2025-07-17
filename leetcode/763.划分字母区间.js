/*
 * @lc app=leetcode.cn id=763 lang=javascript
 *
 * [763] 划分字母区间
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function (s) {
  const lastPos = {}; // 记录每个字符最后出现的位置

  // 记录每个字符最后出现的位置
  for (let i = 0; i < s.length; i++) {
    lastPos[s[i]] = i;
  }

  const result = [];
  let start = 0,
    end = 0;

  // 再次遍历，确定分割点
  for (let i = 0; i < s.length; i++) {
    // 更新当前片段的结束位置
    end = Math.max(end, lastPos[s[i]]);

    // 如果当前位置到达了片段结束位置，记录片段长度
    if (i === end) {
      result.push(i - start + 1);
      start = i + 1; // 更新下一个片段的开始位置
    }
  }

  return result;
};
// @lc code=end

// 算法步骤详解：
// 1. 第一次遍历：记录每个字符最后一次出现的位置到lastPos哈希表中
// 2. 第二次遍历：
//    - 用start和end分别记录当前片段的开始和结束位置
//    - 对于每个字符，更新end = max(end, lastPos[s[i]])
//    - 当i等于end时，说明当前位置就是一个分割点
//    - 计算当前片段长度(i - start + 1)并加入结果数组
//    - 更新下一个片段的start = i + 1

// 这种贪心算法的思路是：对于遇到的每个字符，必须将其最后一次出现的位置也包含在当前片段中，这样就能保证同一个字符只出现在一个片段中。

// 时间复杂度：O(n)，其中n是字符串长度，需要两次遍历字符串
// 空间复杂度：O(1)，因为字符集是固定的（最多26个小写字母）