/*
 * @lc app=leetcode.cn id=287 lang=javascript
 *
 * [287] 寻找重复数
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findDuplicate = function(nums) {
    // 方法一：二分查找
    let left = 1;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        let count = 0;
        
        // 统计小于等于mid的数字个数
        for (let num of nums) {
            if (num <= mid) count++;
        }
        
        // 如果小于等于mid的数字个数超过mid，说明重复数字在[left, mid]区间
        if (count > mid) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
    
    /* 
    // 方法二：快慢指针（Floyd的龟兔赛跑算法）
    let slow = nums[0];
    let fast = nums[0];
    
    // 寻找相遇点
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow !== fast);
    
    // 寻找入环点
    slow = nums[0];
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    
    return slow;
    */
};
// @lc code=end

// 两种解决方案：

// 1. **二分查找法**：
//    - 时间复杂度：O(n log n)
//    - 空间复杂度：O(1)
//    - 原理：利用抽屉原理（鸽笼原理），对1到n的数字范围进行二分查找。统计数组中小于等于mid的数字个数，如果数量大于mid，说明重复数字在左半部分[left, mid]；否则在右半部分[mid+1, right]。

// 2. **快慢指针法**（Floyd的龟兔赛跑算法）：
//    - 时间复杂度：O(n)
//    - 空间复杂度：O(1)
//    - 原理：将问题转化为检测链表中的环。将数组看作一个隐式链表，nums[i]表示从索引i指向索引nums[i]。由于有重复元素，会形成环。使用快慢指针确定环的入口点即为重复数字。

// 当前代码已经启用了二分查找法，快慢指针法被注释掉了。两种方法都满足题目要求的不修改原数组且只用O(1)额外空间。

// 快慢指针法的时间复杂度更优，但二分查找法可能更容易理解。
