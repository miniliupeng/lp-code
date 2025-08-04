// 解析URL query参数
// 如：https://www.example.com:8080/path/to/page?name=张三&age=25&hobby=编程#section1

/**
 * 方法1: 使用URLSearchParams解析查询参数 (推荐)
 */

// ## 1. 内置解码机制
// `URLSearchParams` 是浏览器原生API，它在内部已经实现了URL解码功能。当你创建 `URLSearchParams` 对象或使用 `new URL().searchParams` 时，浏览器会自动：
// - 识别URL编码的字符
// - 将 `%XX` 格式转换回原始字符
// - 返回已解码的值


// ## 2. 性能优势
// 浏览器内部的解码实现通常比JavaScript层面的处理更高效：
// - 使用底层C++实现
// - 优化的字符处理算法
// - 减少了重复解码操作

function parseQuery1(url) {
  return Object.fromEntries(new URL(url).searchParams.entries());
}

/**
 * 方法2: 手动解析查询字符串
 */

//  URL编码概念
// URL只能包含特定的字符集（主要是ASCII字符），当URL中包含特殊字符、中文、空格等时，浏览器会自动将这些字符转换成 `%` 加十六进制数字的形式，这就是URL编码（百分号编码）。

function parseQuery2(url) {
  const params = {};
  const query = url.split('?')[1]?.split('#')[0];
  
  if (query) {
    query.split('&').forEach(param => {
      const [key, value = ''] = param.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
  }
  
  return params;
}

/**
 * 方法3: 正则表达式解析
 */


// ## 1. 正则表达式分解
// ```javascript
// const queryRegex = /[?&]([^=#]+)=([^&#]*)/g;
// ```

// **各部分含义：**
// - `[?&]` - 匹配问号`?`或者和号`&`（参数分隔符）
// - `([^=#]+)` - **第一个捕获组**，匹配参数名
//   - `[^=#]` 表示"不是等号也不是井号的字符"
//   - `+` 表示"一个或多个"
// - `=` - 匹配等号（键值分隔符）
// - `([^&#]*)` - **第二个捕获组**，匹配参数值
//   - `[^&#]` 表示"不是和号也不是井号的字符"
//   - `*` 表示"零个或多个"（允许空值）
// - `g` - **全局标志**，匹配所有符合条件的结果

// ## 2. 匹配示例
// 对于URL：`https://example.com?name=张三&age=25&city=#section1`

// **匹配过程：**
// 1. 第一次匹配：`?name=张三`
//    - `match[0]` = `?name=张三`（完整匹配）
//    - `match[1]` = `name`（第一个捕获组）
//    - `match[2]` = `张三`（第二个捕获组）

// 2. 第二次匹配：`&age=25`
//    - `match[1]` = `age`
//    - `match[2]` = `25`

// 3. 第三次匹配：`&city=`
//    - `match[1]` = `city`
//    - `match[2]` = `""` （空字符串）

// ## 3. exec()方法工作原理
// - `regex.exec(string)` 每次调用返回一个匹配结果
// - 由于使用了`g`标志，每次调用会从上次结束位置继续搜索
// - 当没有更多匹配时返回`null`，循环结束
// - 返回的`match`数组包含完整匹配和各个捕获组
function parseQuery3(url) {
  const params = {};

  // 匹配查询参数的正则表达式
  const queryRegex = /[?&]([^=#]+)=([^&#]*)/g;
  let match;

  while ((match = queryRegex.exec(url)) !== null) {
    const key = decodeURIComponent(match[1]);
    const value = decodeURIComponent(match[2]);
    params[key] = value;
  }

  return params;
}

console.log(parseQuery1('https://www.example.com:8080/path/to/page?name=张三&age=25&hobby=编程#section1'));
console.log(parseQuery2('https://www.example.com:8080/path/to/page?name=张三&age=25&hobby=编程#section1'));
console.log(parseQuery3('https://www.example.com:8080/path/to/page?name=张三&age=25&hobby=编程#section1'));

/[?&]([^=#]+)=([^&#]*)/g