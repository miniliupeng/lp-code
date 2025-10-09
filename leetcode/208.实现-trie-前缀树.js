/*
 * @lc app=leetcode.cn id=208 lang=javascript
 *
 * [208] 实现 Trie (前缀树)
 */

// @lc code=start

// ⭐ 推荐方案：简洁高效的现代实现
var Trie = function () {
  this.root = {};
};

/**
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function (word) {
  let node = this.root;
  for (let c of word) node = node[c] ??= {}; // 空值合并赋值：简洁优雅
  node.isEnd = true;
};

/**
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
  let node = this.root;
  for (let c of word) if (!(node = node[c])) return false; // 边遍历边赋值
  return !!node.isEnd; // 双重否定转布尔值
};

/**
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
  let node = this.root;
  for (let c of prefix) if (!(node = node[c])) return false;
  return true;
};

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
// @lc code=end

/* 
📚 知识点总结：

1. ??= 运算符（空值合并赋值）
   node[c] ??= {}  等价于  if (!node[c]) node[c] = {}
   只在值为 null/undefined 时才赋值，比 ||= 更精确

2. 边遍历边赋值技巧
   if (!(node = node[c])) return false
   先赋值 node = node[c]，再判断是否为 falsy

3. !! 双重否定转布尔
   !!node.isEnd  将 undefined → false，true → true

4. 时间复杂度：O(m)，m 为字符串长度
   空间复杂度：O(n×m)，n 为单词数

5. Trie 的优势：
   - 前缀查询极快
   - 共享公共前缀，节省空间
   - 适合：自动补全、拼写检查、IP路由表
*/
