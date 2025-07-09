/*
 * @lc app=leetcode.cn id=153 lang=javascript
 *
 * [153] 寻找旋转排序数组中的最小值
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    
    if (nums[mid] > nums[right]) {
      // 最小值在右半部分
      left = mid + 1;
    } else {
      // 最小值在左半部分（包括mid）
      right = mid;
    }
  }
  
  // 当left和right相遇时，指向的就是最小值
  return nums[left];
};
// @lc code=end

// 解法思路：

// 这个问题可以使用二分查找来解决。旋转排序数组的一个重要特性是，当我们将数组一分为二时，至少有一半是有序的。

// 关键思路如下：
// 1. 使用二分查找，维护左右指针
// 2. 比较中间元素 `nums[mid]` 与最右元素 `nums[right]` 的大小关系
// 3. 如果 `nums[mid] > nums[right]`，说明最小值在右半部分
// 4. 如果 `nums[mid] <= nums[right]`，说明最小值在左半部分（包括 mid）

// 代码已实现，时间复杂度为 O(log n)，空间复杂度为 O(1)。

// 具体实现过程：
// 1. 初始化左指针 left = 0 和右指针 right = nums.length - 1
// 2. 当 left < right 时，进行二分查找
// 3. 计算中间位置 mid = Math.floor((left + right) / 2)
// 4. 比较 nums[mid] 和 nums[right]
// 5. 最终 left 和 right 会指向同一个位置，即为最小值

// 这个解法适用于没有重复元素的旋转排序数组。