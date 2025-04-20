// 将模板字符串中的插值（如 {{user.name}}）编译为具体的值。例如，输入模板 "Hello, {{user.name}}!" 和数据 {user: {name: "Alice"}}，输出 "Hello, Alice!"。

function compile(template, data) {
  return template.replace(/{{(.*?)}}/g, (match, path) => {
    return path.split('.').reduce((acc, key) => acc && acc[key], data);
  });
}

console.log(compile('Hello, {{user.name}}!', { user: { name: 'Alice' } }));