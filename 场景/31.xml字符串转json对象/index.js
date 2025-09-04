// 测试
const xml = `<root>
  <name>张三</name>
  <age>25</age>
  <address>
    <city>北京</city>
    <street>中关村大街</street>
  </address>
</root>`;

// 超简单实现 - 使用DOMParser
function parseXML(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  
  function nodeToObj(node) {
    const obj = {};
    
    // 遍历子节点
    for (const child of node.children) {
      const key = child.tagName;
      
      // 如果有子元素，递归处理
      if (child.children.length > 0) {
        obj[key] = nodeToObj(child);
      } else {
        // 纯文本节点
        obj[key] = child.textContent;
      }
    }
    
    return obj;
  }
  
  return nodeToObj(doc);
}

// const result = parseXML(xml);
// console.log('DOMParser方法结果:');
// console.log(JSON.stringify(result, null, 2));

// 正则表达式方法 - 更简单
function parseXMLRegex(xmlString) {
  const result = {};
  
  // 匹配所有标签对 <tag>content</tag>
  const regex = /<(\w+)>([\s\S]*?)<\/\1>/g;
  let match;
  
  while ((match = regex.exec(xmlString)) !== null) {
    const [, tagName, content] = match;
    
    // 如果内容包含标签，递归处理
    if (content.includes('<')) {
      result[tagName] = parseXMLRegex(content);
    } else {
      // 纯文本，去掉空白
      result[tagName] = content.trim();
    }
  }
  
  return result;
}

console.log('\n正则表达式方法结果:');
const result2 = parseXMLRegex(xml);
console.log(JSON.stringify(result2, null, 2));