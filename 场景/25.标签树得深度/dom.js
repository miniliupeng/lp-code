const htmlStr = `
    <div>
        <div>
            <span>123</span>
            <a>222</a>
            <div>
                <button><span></span></button>
                <br/>
            </div>
        </div>
    </div>
`;

function getHtmlTreeDepth(htmlStr) {
  // 创建一个完整的HTML文档以确保解析正确
  const wrappedHtml = `<div id="root">${htmlStr}</div>`;

  // 使用DOMParser解析HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(wrappedHtml, 'text/html');
  const rootElement = doc.getElementById('root');

  // 递归计算最大深度
  function calculateDepth(node) {
    // 仅考虑元素节点
    if (node.nodeType !== Node.ELEMENT_NODE) return 0;
    
    // 如果没有子节点或只有文本节点，深度为1
    if (!node.children.length) return 1;
    
    // 找出所有子元素中最大深度
    return 1 + Math.max(...Array.from(node.children).map(calculateDepth));
  }

  // 计算根元素的深度
  return calculateDepth(rootElement) - 1;
}

const depth = getHtmlTreeDepth(htmlStr);
console.log(depth); // 输出: 4