/*
 * @lc app=leetcode.cn id=1513 lang=javascript
 *
 * [1513] 仅含 1 的子串数
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var numSub = function(s) {
    // const MOD = 1e9 + 7;
    let count = 0;
    let consecutiveOnes = 0;
    
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '1') {
            consecutiveOnes++;
            // count = (count + consecutiveOnes) % MOD;
            count = count + consecutiveOnes
        } else {
            consecutiveOnes = 0;
        }
    }
    
    return count;
};
// @lc code=end

console.log(numSub('111'));

