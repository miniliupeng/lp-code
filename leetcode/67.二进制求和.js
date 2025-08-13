/*
 * @lc app=leetcode.cn id=67 lang=javascript
 *
 * [67] 二进制求和
 */

// @lc code=start
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function (a, b) {
  let res = '';
  let carry = 0;
  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0 || j >= 0) {
    const x = i >= 0 ? Number(a[i]) : 0;
    const y = j >= 0 ? Number(b[j]) : 0;
    const sum = x + y + carry;

    res = (sum % 2) + res;
    carry = Math.floor(sum / 2);

    i--;
    j--;
  }

  if (carry) {
    res = carry + res;
  }

  return res;
};
// @lc code=end
