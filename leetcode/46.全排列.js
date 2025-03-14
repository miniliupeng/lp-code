/*
 * @lc app=leetcode.cn id=46 lang=javascript
 *
 * [46] 全排列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */

function backtrack(list, temp, nums) {
  // 1. 终止条件
  if (temp.length === nums.length) return list.push([...temp]);
  for (let i = 0; i < nums.length; i++) {
    if (temp.includes(nums[i])) {
      continue;
    }
    // 放进去一个元素
    temp.push(nums[i]);
    // 执行递归公式
    backtrack(list, temp, nums);
    // 撤回这个元素
    temp.pop();
  }
}

var permute = function (nums) {
  let list = [];
  backtrack(list, [], nums);
  return list;
};
// @lc code=end

permute([1, 2, 3]);
