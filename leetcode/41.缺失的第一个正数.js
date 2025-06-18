/*
 * @lc app=leetcode.cn id=41 lang=javascript
 *
 * [41] 缺失的第一个正数
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */

// dismiss
var firstMissingPositive = function(nums) {
    const n = nums.length;
    
    // 第一步：将数组中的数放到正确的位置上
    // 正确的位置是：数字x应该放在索引x-1的位置上
    for (let i = 0; i < n; i++) {
        // 只处理在[1,n]范围内的数，并且当前数字不在正确位置上
        // nums[i] !== nums[nums[i] - 1]保证不会无限循环交换相同的数
        while (nums[i] > 0 && nums[i] <= n && nums[i] !== nums[nums[i] - 1]) {
            // 交换nums[i]和nums[nums[i] - 1]
            let temp = nums[nums[i] - 1];
            nums[nums[i] - 1] = nums[i];
            nums[i] = temp;
        }
    }
    
    // 第二步：找到第一个位置不正确的数
    for (let i = 0; i < n; i++) {
        // 如果该位置上的数不等于i+1，说明i+1缺失
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    
    // 如果数组中包含了1到n的所有数字，则缺失的第一个正数是n+1
    return n + 1;
};
// @lc code=end

