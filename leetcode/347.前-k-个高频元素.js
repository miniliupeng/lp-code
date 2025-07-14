/*
 * @lc app=leetcode.cn id=347 lang=javascript
 *
 * [347] 前 K 个高频元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
    // 使用Map统计每个元素出现的频率
    const freqMap = new Map();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }
    
    // 将元素及其频率转换为数组并按频率降序排序
    const sortedArr = Array.from(freqMap).sort((a, b) => b[1] - a[1]);
    
    // 提取前k个高频元素
    return sortedArr.slice(0, k).map(item => item[0]);
};
// @lc code=end
