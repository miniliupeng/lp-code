/*
 * @lc app=leetcode.cn id=215 lang=javascript
 *
 * [215] 数组中的第K个最大元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */

var findKthLargest = function (nums, k) {
  const n = nums.length;
  return quickSelect(nums, 0, n - 1, n - k);
};

function quickSelect(nums, l, r, k) {
  // 基准情况：如果左右边界相等，直接返回
  if (l === r) return nums[k];

  // 选择最左边的元素作为基准值
  const x = nums[l];
  let i = l - 1,
    j = r + 1;

  // 分区过程
  while (i < j) {
    // 找到左边第一个大于等于基准值的元素
    do i++;
    while (nums[i] < x);
    // 找到右边第一个小于等于基准值的元素
    do j--;
    while (nums[j] > x);

    // 交换这两个元素
    if (i < j) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }

  // 根据 k 的位置决定递归哪一部分
  if (k <= j) {
    return quickSelect(nums, l, j, k);
  } else {
    return quickSelect(nums, j + 1, r, k);
  }
}
// @lc code=end
