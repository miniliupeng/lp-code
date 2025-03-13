/*
 * @lc app=leetcode.cn id=69 lang=javascript
 *
 * [69] x 的平方根
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
  if (x === 0) return 0
  let result  = x

  while (result > x / result) {
    result = Math.floor((result + x / result) / 2)
  }



  return result
};
// @lc code=end
