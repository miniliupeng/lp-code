// 保存状态和索引
let states = [];
let currentIndex = 0;

// 保存 effect 相关信息
let effectHooks = [];
let effectIndex = 0;

// 重置索引的函数，在每次组件重新渲染前调用
function resetIndex() {
  currentIndex = 0;
  effectIndex = 0;
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

/**
 * 实现React的useEffect钩子函数
 * @param {Function} effectCallback 副作用回调函数
 * @param {Array|undefined} dependencies 依赖数组
 */
function useEffect(effectCallback, dependencies) {
  // 获取当前处理的effect索引
  const index = effectIndex;
  
  // 获取上一次的effect信息
  const oldEffect = effectHooks[index];
  
  // 创建新的effect信息
  const effect = {
    effectCallback,
    dependencies,
    cleanup: oldEffect ? oldEffect.cleanup : undefined
  };
  
  // 判断是否需要执行effect
  const shouldRunEffect = () => {
    // 如果是首次渲染或者没有依赖数组，则执行
    if (!oldEffect || !dependencies) return true;
    
    // 如果当前依赖数组是空数组，且之前没有依赖数组信息，则执行
    if (dependencies.length === 0 && !oldEffect.dependencies) return true;
    
    // 如果依赖项有变化，则执行
    return dependencies.some((dep, i) => !Object.is(dep, oldEffect.dependencies[i]));
  };
  
  // 存储新的effect信息
  effectHooks[index] = effect;
  
  // 处理完一个useEffect后，索引加1，为下一个useEffect做准备
  effectIndex++;
  
  // 将effect放入宏任务队列，模拟React的行为
  if (shouldRunEffect()) {
    // 如果有清理函数，先执行清理
    if (oldEffect && oldEffect.cleanup) {
      oldEffect.cleanup();
    }
    
    // 执行effect回调，并保存清理函数
    setTimeout(() => {
      // 执行副作用函数，并保存返回的清理函数
      const cleanup = effectCallback();
      effectHooks[index].cleanup = cleanup;
    });
  }
}

// 模拟组件函数
function Component() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('你好');
  
  useEffect(() => {
    console.log('Effect: count发生变化', count);
    // 返回一个清理函数
    return () => {
      console.log('清理上一个effect: count =', count);
    };
  }, [count]); // 仅在count变化时执行
  
  useEffect(() => {
    console.log('Effect: text发生变化', text);
    // 返回一个清理函数
    return () => {
      console.log('清理上一个effect: text =', text);
    };
  }, [text]); // 仅在text变化时执行
  
  useEffect(() => {
    console.log('Effect: 组件每次渲染都会执行');
    // 无清理函数
  }); // 没有依赖数组，每次渲染都会执行
  
  useEffect(() => {
    console.log('Effect: 仅在组件首次渲染时执行');
    // 无清理函数
  }, []); // 空依赖数组，仅在首次渲染时执行
  
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