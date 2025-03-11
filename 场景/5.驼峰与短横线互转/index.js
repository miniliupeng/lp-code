function kebabToCamel(kebabStr) {
  return kebabStr.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

function camelToKebab(camelStr) {
  return camelStr.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// 测试
console.log(kebabToCamel('background-color'));  // 输出: backgroundColor
console.log(kebabToCamel('list-item-name'));    // 输出: listItemName
console.log(camelToKebab('backgroundColor'));  // 输出: background-color
console.log(camelToKebab('listItemName'));     // 输出: list-item-name
