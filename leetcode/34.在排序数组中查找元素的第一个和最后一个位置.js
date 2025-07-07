/*
 * @lc app=leetcode.cn id=34 lang=javascript
 *
 * [34] 在排序数组中查找元素的第一个和最后一个位置
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    // Find the first occurrence of target
    const findFirst = (nums, target) => {
        let left = 0;
        let right = nums.length - 1;
        let firstPos = -1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (nums[mid] === target) {
                firstPos = mid; // Save this position
                right = mid - 1; // Continue searching in the left part
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return firstPos;
    };
    
    // Find the last occurrence of target
    const findLast = (nums, target) => {
        let left = 0;
        let right = nums.length - 1;
        let lastPos = -1;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (nums[mid] === target) {
                lastPos = mid; // Save this position
                left = mid + 1; // Continue searching in the right part
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return lastPos;
    };
    
    const first = findFirst(nums, target);
    const last = findLast(nums, target);
    
    return [first, last];
};
// @lc code=end

