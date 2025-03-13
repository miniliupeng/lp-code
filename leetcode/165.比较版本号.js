/*
 * @lc app=leetcode.cn id=165 lang=javascript
 *
 * [165] 比较版本号
 */

// @lc code=start
/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
var compareVersion = function (version1, version2) {
  // 将版本号按点分割成数组
  const v1 = version1.split('.');
  const v2 = version2.split('.');

  // 获取最长的数组长度
  const maxLength = Math.max(v1.length, v2.length);

  // 逐个比较修订号
  for (let i = 0; i < maxLength; i++) {
    // 获取当前修订号，如果不存在则默认为0
    const num1 = parseInt(v1[i] || 0);
    const num2 = parseInt(v2[i] || 0);

    // 比较当前修订号
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  // 所有修订号都相等
  return 0;
};
// @lc code=end
