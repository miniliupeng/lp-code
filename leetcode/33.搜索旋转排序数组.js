/*
 * @lc app=leetcode.cn id=33 lang=javascript
 *
 * [33] 搜索旋转排序数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] === target) {
            return mid;
        }
        
        // 判断哪一部分是有序的
        if (nums[left] <= nums[mid]) {  // 左半部分有序
            // 判断 target 是否在左半部分
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;  // 在左半部分搜索
            } else {
                left = mid + 1;   // 在右半部分搜索
            }
        } else {  // 右半部分有序
            // 判断 target 是否在右半部分
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;   // 在右半部分搜索
            } else {
                right = mid - 1;  // 在左半部分搜索
            }
        }
    }
    
    return -1;  // 没有找到目标值
};
// @lc code=end

