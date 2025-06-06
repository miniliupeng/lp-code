/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
  const res = [],
    count = Array(26).fill(0); // 结果数组和字符频率计数数组
  for (let c of p) count[c.charCodeAt(0) - 97]++; // 统计模式串p中每个字符的出现频率
  let l = 0,
    r = 0,
    need = p.length; // 左右指针和需要匹配的字符数
  while (r < s.length) {
    // 滑动窗口
    if (count[s.charCodeAt(r++) - 97]-- > 0) need--; // 如果当前字符在p中存在,need减1
    if (need === 0) res.push(l); // 当need为0时,找到一个异位词
    if (r - l === p.length && count[s.charCodeAt(l++) - 97]++ >= 0) need++; // 窗口满时移除左字符
  }
  return res; // 返回所有异位词起始位置
};
