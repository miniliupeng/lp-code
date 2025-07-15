/*
 * @lc app=leetcode.cn id=121 lang=javascript
 *
 * [121] 买卖股票的最佳时机
 */

// @lc code=start
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {

  let minPrice = prices[0];
  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    // 更新最低价格
    minPrice = Math.min(minPrice, prices[i]);
    // 计算当前可能的利润
    const currentProfit = prices[i] - minPrice;
    // 更新最大利润
    maxProfit = Math.max(maxProfit, currentProfit);
  }

  return maxProfit;
};
// @lc code=end
