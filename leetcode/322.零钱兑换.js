/*
 * @lc app=leetcode.cn id=322 lang=javascript
 *
 * [322] 零钱兑换
 */

// @lc code=start
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    // 创建dp数组，初始值设为Infinity
    const dp = new Array(amount + 1).fill(Infinity);
    // 设置初始状态
    dp[0] = 0;
    
    // 遍历所有金额
    for (let i = 1; i <= amount; i++) {
        // 遍历所有硬币面值
        for (const coin of coins) {
            // 当前面值可用于构成金额i
            if (i - coin >= 0) {
                // 状态转移方程：取最小值
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    // 如果dp[amount]仍为Infinity，表示无法组成该金额
    return dp[amount] === Infinity ? -1 : dp[amount];
};
// @lc code=end

