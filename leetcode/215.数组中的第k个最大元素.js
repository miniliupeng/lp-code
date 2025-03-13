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
  if (l === r) return nums[k];

  const x = nums[l];
  let i = l - 1,
    j = r + 1;

  while (i < j) {
    do i++;
    while (nums[i] < x);
    do j--;
    while (nums[j] > x);

    if (i < j) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }

  if (k <= j) {
    return quickSelect(nums, l, j, k);
  } else {
    return quickSelect(nums, j + 1, r, k);
  }
}
// @lc code=end
