/*
 * @lc app=leetcode.cn id=75 lang=javascript
 *
 * [75] 颜色分类
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function(nums) {
    // 使用荷兰国旗算法（三指针）
    let left = 0;            // 0的右边界
    let right = nums.length - 1;  // 2的左边界
    let current = 0;         // 当前遍历位置
    
    while (current <= right) {
        if (nums[current] === 0) {
            // 交换current和left位置的元素
            [nums[current], nums[left]] = [nums[left], nums[current]];
            left++;
            current++;
        } else if (nums[current] === 2) {
            // 交换current和right位置的元素
            [nums[current], nums[right]] = [nums[right], nums[current]];
            right--;
            // 注意这里不增加current，因为交换后的元素需要再次判断
        } else {
            // nums[current] === 1，不需要交换，直接向右移动
            current++;
        }
    }
};
// @lc code=end




// 使用荷兰国旗算法解决了颜色分类问题。这个算法是专门为解决这类三路划分问题设计的。

// 算法思路：
// 1. 设置三个指针：
//    - left：指向0的右边界
//    - right：指向2的左边界
//    - current：当前遍历位置
   
// 2. 遍历数组（当current <= right时）：
//    - 如果当前元素是0：将其与left位置元素交换，left和current都向右移动
//    - 如果当前元素是2：将其与right位置元素交换，right向左移动，current不变（因为交换过来的新元素还需要判断）
//    - 如果当前元素是1：current直接向右移动

// 3. 算法结束后，数组被分为三部分：
//    - [0, left)：全部是0
//    - [left, current)：全部是1
//    - [right+1, 数组末尾)：全部是2

// 该算法只需遍历一次数组，时间复杂度为O(n)，空间复杂度为O(1)。
