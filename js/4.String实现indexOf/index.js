function indexOf(str, searchStr, fromIndex = 0) {
  if (!searchStr) return fromIndex;

  const start = Math.max(0, fromIndex);

  for (let i = start; i < str.length - searchStr.length; i++) {
    let found = true;

    for (let j = 0; j < searchStr.length; j++) {
      if (str[i + j] !== searchStr[j]) {
        found = false;
        break;
      }
    }

    if (found) return i;
  }

  return -1;
}

// 测试
console.log(indexOf('hello world', 'world')); // 6
console.log(indexOf('hello world', 'world', 7)); // -1
console.log(indexOf('hello world', '')); // 0
