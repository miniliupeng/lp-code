/*
 * @lc app=leetcode.cn id=17 lang=javascript
 *
 * [17] 电话号码的字母组合
 */

// @lc code=start
/**
 * @param {string} digits
 * @return {string[]}
 */

const map = {
  2: 'abc',
  3: 'def',
  4: 'ghi',
  5: 'jkl',
  6: 'mno',
  7: 'pqrs',
  8: 'tuv',
  9: 'wxyz'
};

var letterCombinations = function (digits) {
  if (digits.length === 0) return [];

  const result = [];

  const backtrack = (index, currentStr) => {
    if (index === digits.length) return result.push(currentStr);

    const letters = map[digits[index]];
    for (const letter of letters) {
      backtrack(index + 1, currentStr + letter);
    }
  };

  backtrack(0, '');
  return result;
};
// @lc code=end

// 解题思路：

// 1.  创建一个从数字到字母的映射表。
// 2.  使用一个递归函数进行回溯。这个函数会记录当前正在处理的数字在输入字符串中的索引，以及当前已经生成的字符串组合。
// 3.  当处理的索引等于输入数字字符串的长度时，说明一个完整的组合已经生成，就将其添加到结果列表中。
// 4.  否则，获取当前索引对应的数字，并遍历其可以代表的所有字母。对每个字母，都递归调用函数，进入下一层决策。
