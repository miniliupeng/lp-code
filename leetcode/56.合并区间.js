/*
 * @lc app=leetcode.cn id=56 lang=javascript
 *
 * [56] 合并区间
 */

// @lc code=start
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  // 按照区间起始位置排序
  intervals.sort((a, b) => a[0] - b[0])

  // 将第一个区间加入结果集
  const result = [intervals[0]] 

  // 遍历剩余区间
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i]
    const last = result[result.length - 1]

    // 如果当前区间的起始位置小于等于上一个区间的结束位置，则合并
    if (current[0] <= last[1]) {
      // 合并区间，更新结束位置为两个区间结束位置的最大值
      last[1] = Math.max(last[1], current[1])
    } else {
      // 不能合并，将当前区间加入结果集
      result.push(current)
    }
  }

  return result
};
// @lc code=end

