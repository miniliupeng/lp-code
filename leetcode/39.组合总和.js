/*
 * @lc app=leetcode.cn id=39 lang=javascript
 *
 * [39] 组合总和
 */

// @lc code=start
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (candidates, target) {
  const res = [];
  const path = [];
  candidates.sort((a, b) => a - b); // 排序用于剪枝优化

  const backtrack = (start, remaining) => {
    if (remaining === 0) return res.push([...path]);

    for (let i = start; i < candidates.length; i++) {
      const candidate = candidates[i];

      // 剪枝：如果当前数字已经比剩余的目标值大，后续的数字更大，无需继续
      if (candidate > remaining) break;

      path.push(candidate);
      // 递归，因为可以重复使用数字，所以下一次的起始索引还是 i
      backtrack(i, remaining - candidate);
      path.pop(); // 回溯
    }
  };

  backtrack(0, target);
  return res;
};
// @lc code=end
