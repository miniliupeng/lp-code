// 逗号分隔

const value = 1234567890

const formattedValue1 = value.toLocaleString('en-US')

const formattedValue2 = new Intl.NumberFormat('en-US').format(value)

const formattedValue3 = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

// 方法4：使用循环逐步添加逗号
function formatNumberWithLoop(num) {
  let str = num.toString();
  let result = '';
  
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && (str.length - i) % 3 === 0) {
      result += ',';
    }
    result += str[i];
  }
  
  return result;
}

// 方法5：使用split和正则一起实现
function formatNumberWithSplit(num) {
  return num.toString().split(/(?=(?:\d{3})+$)/).join(',');
}


console.log('方法1 (toLocaleString):', formattedValue1);
console.log('方法2 (Intl.NumberFormat):', formattedValue2);
console.log('方法3 (replace正则):', formattedValue3);
console.log('方法4 (循环):', formatNumberWithLoop(value));
console.log('方法5 (split正则):', formatNumberWithSplit(value));


