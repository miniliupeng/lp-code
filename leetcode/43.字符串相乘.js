/*
 * @lc app=leetcode.cn id=43 lang=javascript
 *
 * [43] 字符串相乘
 */

// @lc code=start
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function (num1, num2) {
  // 特殊情况处理
  if (num1 === '0' || num2 === '0') return '0';

  const len1 = num1.length;
  const len2 = num2.length;
  // 结果数组，最多 len1 + len2 位
  const result = new Array(len1 + len2).fill(0);

  // 从右到左遍历两个数字
  for (let i = len1 - 1; i >= 0; i--) {
    for (let j = len2 - 1; j >= 0; j--) {
      // 当前位置的乘积
      const mul = num1[i] * num2[j];
      // 在结果数组中的位置
      const p1 = i + j;
      const p2 = i + j + 1;
      // 加上之前的结果
      const sum = mul + result[p2];

      // 处理进位
      result[p2] = sum % 10;
      result[p1] += Math.floor(sum / 10);
    }
  }

  // 去除前导零，转换为字符串
  let i = 0;
  while (i < result.length && result[i] === 0) {
    i++;
  }

  return result.slice(i).join('');
};
// @lc code=end
