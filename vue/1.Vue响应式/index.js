// 手写Vue响应式系统（基于Proxy和Reflect）

// 依赖收集器 - 存储响应式对象、属性和对应的副作用函数
const targetMap = new WeakMap();

// 当前活跃的副作用函数
let activeEffect = null;

/**
 * 创建响应式对象
 * @param {Object} target - 需要被代理的原始对象
 * @returns {Proxy} - 响应式代理对象
 */
function reactive(target) {
  // 检查参数是否为对象
  if (typeof target !== 'object' || target === null) {
    console.warn(`reactive() 只能接收对象作为参数，但是接收到: ${typeof target}`);
    return target;
  }
  
  // 创建Proxy代理
  const proxy = new Proxy(target, {
    // 拦截属性读取操作
    get(target, key, receiver) {
      // 收集依赖
      track(target, key);
      // 使用Reflect获取原始值，保持this指向正确
      const result = Reflect.get(target, key, receiver);
      // 如果结果仍是对象，递归创建响应式对象
      if (typeof result === 'object' && result !== null) {
        return reactive(result);
      }
      return result;
    },
    
    // 拦截属性设置操作
    set(target, key, value, receiver) {
      // 获取旧值
      const oldValue = Reflect.get(target, key, receiver);
      // 使用Reflect设置新值
      const result = Reflect.set(target, key, value, receiver);
      // 如果值发生变化，触发更新
      if (oldValue !== value) {
        trigger(target, key);
      }
      return result;
    },
    
    // 拦截属性删除操作
    deleteProperty(target, key) {
      // 检查属性是否存在且可配置
      const hadKey = Reflect.has(target, key);
      // 使用Reflect删除属性
      const result = Reflect.deleteProperty(target, key);
      // 如果成功删除了属性，触发更新
      if (hadKey && result) {
        trigger(target, key);
      }
      return result;
    }
  });
  
  return proxy;
}

/**
 * 跟踪依赖
 * @param {Object} target - 目标对象
 * @param {string|symbol} key - 属性名
 */
function track(target, key) {
  // 如果没有活跃的副作用函数，直接返回
  if (!activeEffect) return;
  
  // 获取目标对象的依赖Map
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  
  // 获取属性对应的依赖集合
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  
  // 添加当前副作用函数到依赖集合
  dep.add(activeEffect);
}

/**
 * 触发更新
 * @param {Object} target - 目标对象
 * @param {string|symbol} key - 属性名
 */
function trigger(target, key) {
  // 获取目标对象的依赖Map
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  
  // 获取属性对应的依赖集合
  const dep = depsMap.get(key);
  if (!dep) return;
  
  // 触发所有收集的副作用函数
  dep.forEach(effect => {
    // 如果副作用函数有调度器，则通过调度器执行
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      // 否则直接执行副作用函数
      effect();
    }
  });
}

/**
 * 创建副作用函数
 * @param {Function} fn - 需要执行的函数
 * @param {Object} options - 配置选项
 * @returns {Function} - 包装后的副作用函数
 */
function effect(fn, options = {}) {
  // 创建副作用函数
  const effectFn = () => {
    try {
      activeEffect = effectFn;
      // 执行函数以收集依赖
      return fn();
    } finally {
      // 重置当前活跃的副作用函数
      activeEffect = null;
    }
  };
  
  // 保存配置选项
  effectFn.scheduler = options.scheduler;
  
  // 立即执行一次副作用函数，进行初始依赖收集
  if (!options.lazy) {
    effectFn();
  }
  
  return effectFn;
}

/**
 * 计算属性
 * @param {Function} getter - 获取计算值的函数
 * @returns {Object} - 具有value属性的对象
 */
function computed(getter) {
  // 缓存标志和值
  let dirty = true;
  let value;
  
  // 创建副作用函数
  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      // 当依赖变化时，将dirty设为true
      dirty = true;
      // 触发计算属性自身的更新
      trigger(result, 'value');
    }
  });
  
  const result = {
    get value() {
      // 如果dirty为true，重新计算
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      // 收集对计算属性的依赖
      track(result, 'value');
      return value;
    }
  };
  
  return result;
}

/**
 * 监听响应式数据变化
 * @param {Object|Function} source - 响应式对象或getter函数
 * @param {Function} callback - 数据变化时的回调
 * @param {Object} options - 配置选项
 */
function watch(source, callback, options = {}) {
  let getter;
  // 判断source类型
  if (typeof source === 'function') {
    getter = source;
  } else {
    getter = () => traverse(source);
  }
  
  // 保存旧值和新值
  let oldValue, newValue;
  
  // 清理函数
  let cleanup;
  
  function onInvalidate(fn) {
    cleanup = fn;
  }
  
  // 调度执行的函数
  const job = () => {
    newValue = effectFn();
    // 在调用回调前执行清理函数
    if (cleanup) {
      cleanup();
    }
    // 调用回调函数，传入新旧值
    callback(newValue, oldValue, onInvalidate);
    // 更新旧值
    oldValue = newValue;
  };
  
  // 创建副作用函数
  const effectFn = effect(getter, {
    lazy: true,
    scheduler: job
  });
  
  // 立即执行
  if (options.immediate) {
    job();
  } else {
    // 手动执行一次，获取旧值
    oldValue = effectFn();
  }
}

/**
 * 递归遍历对象的所有属性
 * @param {Object} obj - 要遍历的对象
 * @param {Set} seen - 已访问对象的集合（防止循环引用）
 */
function traverse(obj, seen = new Set()) {
  // 如果要读取的数据是原始值或已经被访问过，直接返回
  if (typeof obj !== 'object' || obj === null || seen.has(obj)) {
    return obj;
  }
  
  // 将当前对象标记为已访问
  seen.add(obj);
  
  // 递归遍历对象的所有属性
  for (const key in obj) {
    traverse(obj[key], seen);
  }
  
  return obj;
}

// 示例使用
const user = reactive({
  name: '张三',
  age: 20,
  address: {
    city: '北京',
    street: '朝阳区'
  }
});

// 创建副作用
effect(() => {
  console.log(`姓名: ${user.name}, 年龄: ${user.age}, 城市: ${user.address.city}`);
});

// 计算属性
const ageDoubled = computed(() => user.age * 2);
console.log(`年龄的两倍: ${ageDoubled.value}`);

// 监听数据变化
watch(
  () => user.age,
  (newValue, oldValue) => {
    console.log(`年龄从 ${oldValue} 变为 ${newValue}`);
  }
);

// 触发更新
user.name = '李四';
user.age = 25;
user.address.city = '上海';

console.log(`年龄的两倍(更新后): ${ageDoubled.value}`);