const htmlStr = `
    <div>
        <div>
            <span>123</span>
            <a>222</a>
            <div>
                <button>333</button>
                <br/>
            </div>
        </div>
    </div>
`;

function getHtmlTreeDepth(htmlStr) {
  // 使用正则表达式匹配所有标签
  const tags = htmlStr.match(/<\/?[^>]+>/g) || [];
  console.log(tags);

  let stack = [];
  let maxDepth = 0;

  for (let tag of tags) {
    // 忽略自闭合标签如 <br/>
    if (tag.endsWith('/>')) {
      maxDepth = Math.max(maxDepth, stack.length + 1);
      continue;
    }

    // 处理开始标签
    if (!tag.startsWith('</')) {
      stack.push(tag);
      maxDepth = Math.max(maxDepth, stack.length);
    }
    // 处理结束标签
    else {
      stack.pop();
    }
  }

  return maxDepth;
}

const depth = getHtmlTreeDepth(htmlStr);
console.log(depth); // 输出: 4
