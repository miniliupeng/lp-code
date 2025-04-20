function compile(template, context) {
  // 替换模板中的插值表达式为 JavaScript 模板字符串语法
  const compiledTemplate = template.replace(
    /{{(.*?)}}/g,
    (match, p1) => `\${${p1.trim()}}`
  );

  // 动态生成一个函数，用于替换模板中的插值表达式
  const compiledFunction = new Function(
    "context",
    `
    with (context) {
      return \`${compiledTemplate}\`;
    }
  `
  );

  // 调用函数并返回结果
  return compiledFunction(context);
}



const template =
  "Hello, ${user.name}! Your balance is ${user.balance}. You have ${user.items[0]} in your cart. and ${user.items[2].kk}";
const exprObj = {
  user: {
    name: "Alice",
    balance: 100.5,
    items: ["Item1", "Item2", { kk: 1 }],
  },
};
const compiledString = compile(template, exprObj);
console.log(compiledString);
