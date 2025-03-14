/*
 * @lc app=leetcode.cn id=88 lang=javascript
 *
 * [88] 合并两个有序数组
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    // 从后向前的三个指针
    let p = m + n - 1;      // nums1 的末尾位置
    let p1 = m - 1;         // nums1 有效元素的末尾
    let p2 = n - 1;         // nums2 的末尾
    
    // 从后向前遍历
    while (p2 >= 0) {  // 只要 nums2 还有元素需要合并
        if (p1 >= 0 && nums1[p1] > nums2[p2]) {
            nums1[p] = nums1[p1];
            p1--;
        } else {
            nums1[p] = nums2[p2];
            p2--;
        }
        p--;
    }
};
// @lc code=end

