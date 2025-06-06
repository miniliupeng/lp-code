// 保存状态和索引
let states = [];
let currentIndex = 0;

// 重置索引的函数，在每次组件重新渲染前调用
function resetIndex() {
  currentIndex = 0;
}

/**
 * 实现React的useState钩子函数
 * @param {any} initialValue 初始状态值
 * @returns {Array} 返回当前状态和更新状态的函数
 */
function useState(initialValue) {
  // 获取当前处理的状态索引
  const index = currentIndex;
  
  // 如果states数组中不存在当前索引的状态，初始化它
  if (states[index] === undefined) {
    states[index] = initialValue;
  }
  
  // 当前状态
  const state = states[index];
  
  // 更新状态的函数
  const setState = (newValue) => {
    // 如果新值是函数，则调用它并传入当前状态值
    if (typeof newValue === 'function') {
      states[index] = newValue(states[index]);
    } else {
      // 否则直接更新状态
      states[index] = newValue;
    }
    
    // 触发重新渲染（简化处理）
    render();
  };
  
  // 处理完一个useState后，索引加1，为下一个useState做准备
  currentIndex++;
  
  // 返回状态和更新函数
  return [state, setState];
}

// 模拟组件函数
function Component() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('你好');
  
  console.log('渲染组件：', { count, text });
  
  // 模拟返回组件接口
  return {
    clickButton: () => setCount(count + 1),
    changeText: (newText) => setText(newText),
    // 函数式更新示例
    doubleCount: () => setCount(prevCount => prevCount * 2)
  };
}

// 模拟渲染函数
function render() {
  resetIndex(); // 重置索引
  return Component(); // 调用组件函数
}

// 测试示例
console.log('初始渲染');
const app = render();

console.log('点击按钮');
app.clickButton();

console.log('修改文本');
app.changeText('React Hooks');

console.log('双倍计数');
app.doubleCount();