/**
 * 将字符串中 / 或 \ 后面的内容替换成 *
 * 如果没有 / 或 \，则截取第一个字母后面为 *
 * @param {string} str - 输入字符串
 * @returns {string} - 处理后的字符串
 */
function replaceWithAsterisk(str) {
  // 如果包含 / 或 \，则将其后面的内容替换成 *
  if (/[\\/]/.test(str)) {
    return str.replace(/([\\/]).*$/, '*');
  }
  // 否则保留第一个字符，其余替换成 *
  return str.replace(/^(.).+$/, '$1*');
}

// 测试用例
console.log(replaceWithAsterisk('aa\\bb')); // aa*
console.log(replaceWithAsterisk('aabb'));   // a*
console.log(replaceWithAsterisk('aa/bb'));  // aa*
console.log(replaceWithAsterisk('a'));      // a (只有一个字符，没有内容可替换)
console.log(replaceWithAsterisk('abc/def/ghi')); // abc*
console.log(replaceWithAsterisk('hello\\world')); // hello*
console.log(replaceWithAsterisk('test'));   // t*
