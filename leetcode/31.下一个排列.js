/*
 * @lc app=leetcode.cn id=31 lang=javascript
 *
 * [31] 下一个排列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function(nums) {
  // 1. 从后向前找到第一个相邻升序对(i,i+1)，满足 nums[i] < nums[i+1]
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) {
      i--;
  }
  
  // 2. 如果找到了这样的升序对
  if (i >= 0) {
      // 3. 从后向前找到第一个大于nums[i]的数
      let j = nums.length - 1;
      while (j >= 0 && nums[j] <= nums[i]) {
          j--;
      }
      // 4. 交换这两个数
      [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  
  // 5. 将i之后的所有数反转（因为这部分一定是降序的）
  let left = i + 1;
  let right = nums.length - 1;
  while (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
      right--;
  }
};
// @lc code=end

// 这个算法的工作原理是：

// 1. 首先从右向左扫描，找到第一个相邻的升序对，即找到第一个 `nums[i] < nums[i+1]` 的位置。
// 2. 如果找不到这样的升序对，说明整个序列是降序的，那么就将整个序列反转即可。
// 3. 如果找到了升序对，则再次从右向左扫描，找到第一个大于 `nums[i]` 的数。
// 4. 将这两个数交换。
// 5. 最后将位置 i 之后的所有数进行反转，因为这部分在交换后一定是降序的，反转后得到升序，这样可以确保得到的是下一个最小的排列。

// 例如对于序列 `[1,2,3]`，算法会将其变为 `[1,3,2]`；对于 `[3,2,1]`，算法会将其变为 `[1,2,3]`。

// 这个解法的时间复杂度是 O(n)，空间复杂度是 O(1)，完全符合题目要求的原地修改数组。
