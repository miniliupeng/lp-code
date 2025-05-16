// 百分号格式

const value = 0.75;

const formattedValue1 = (value * 100).toFixed(2) + '%'

const formattedValue2 = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}).format(value)

console.log(formattedValue1);
console.log(formattedValue2);

