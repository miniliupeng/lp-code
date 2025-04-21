
let states = []
let currentIndex = 0;

function resetIndex() {
  currentIndex = 0;
}

function useState(initialValue) {
  const index = currentIndex;

  if (states[index] === undefined) {
    states[index] = initialValue
  }

  const state = states[index]

  function setState(newValue) {
    if (typeof newValue === 'function') {
      states[index] = newValue(states[index])
    } else {
      states[index] = newValue
    }

    render()
  }

  currentIndex++;

  return [state, setState]
}


function Component() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('你好')

  console.log('渲染组件：', { count, text });
  
  return {
    clickButton: () => setCount(count + 1),
    doubleCount: () => setCount(count + 1),
    changeText:(text) => setCount(text)
  }
}


function render() {
  resetIndex()
  return Component()
}

console.log('初始渲染');
const app = render()

console.log('点击按钮');
app.clickButton();

console.log('修改文本');
app.changeText('React Hooks');

console.log('双倍计数');
app.doubleCount();
