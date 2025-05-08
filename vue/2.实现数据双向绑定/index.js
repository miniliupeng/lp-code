class VAE {
  constructor(options) {
    this.el = document.querySelector(options.el);
    this.data = options.data;
    // 存储DOM节点与数据的映射关系
    this.domMap = {
      input: {}, // 存储input元素
      text: {}   // 存储文本节点
    };
    this.init();
  }

  init() {
    this.observe(this.data);
    this.compile(this.el);
  }
  
  // 监听数据变化
  observe(data) {
    if (!data || typeof data !== 'object') return;
    
    // 遍历数据对象，为每个属性设置getter和setter
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }

  // 定义响应式数据
  defineReactive(obj, key, val) {
    const self = this;
    
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        return val;
      },
      set(newVal) {
        if (newVal === val) return;
        val = newVal;
        // 更新相关的视图元素
        self.updateElements(key, newVal);
      }
    });
  }

  // 更新与数据相关的所有DOM元素
  updateElements(key, value) {
    // 更新input元素
    if (this.domMap.input[key]) {
      this.domMap.input[key].forEach(input => {
        input.value = value;
      });
    }
    
    // 更新文本节点
    if (this.domMap.text[key]) {
      this.domMap.text[key].forEach(node => {
        this.updateText(node);
      });
    }
  }

  // 编译模板
  compile(el) {
    const nodes = el.childNodes;
    Array.from(nodes).forEach(node => {
      // 元素节点
      if (node.nodeType === 1) {
        // 处理元素节点的属性
        const attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
          if (attr.name === 'v-model') {
            const name = attr.value;
            // 绑定input事件
            node.addEventListener('input', e => {
              this.data[name] = e.target.value;
            });
            // 设置节点的值
            node.value = this.data[name];
            
            // 将input元素添加到domMap中
            if (!this.domMap.input[name]) {
              this.domMap.input[name] = [];
            }
            this.domMap.input[name].push(node);
          }
        });
        
        // 递归处理子节点
        if (node.childNodes && node.childNodes.length) {
          this.compile(node);
        }
      }
      // 文本节点，处理{{}}插值
      else if (node.nodeType === 3) {
        const reg = /\{\{(.*?)\}\}/g;
        const text = node.textContent;
        
        if (reg.test(text)) {
          // 保存原始文本用于后续更新
          node._originalText = text;
          
          // 找出所有的变量，并建立映射关系
          let match;
          const textReg = /\{\{(.*?)\}\}/g;
          while ((match = textReg.exec(text)) !== null) {
            const key = match[1].trim();
            // 为每个变量建立domMap
            if (!this.domMap.text[key]) {
              this.domMap.text[key] = [];
            }
            if (!this.domMap.text[key].includes(node)) {
              this.domMap.text[key].push(node);
            }
          }
          
          this.updateText(node);
        }
      }
    });
  }

  // 更新文本节点
  updateText(node) {
    const text = node._originalText;
    const reg = /\{\{(.*?)\}\}/g;
    
    // 替换所有{{}}中的变量
    let result = text.replace(reg, (match, key) => {
      key = key.trim();
      return this.data[key];
    });
    
    node.textContent = result;
  }
}

