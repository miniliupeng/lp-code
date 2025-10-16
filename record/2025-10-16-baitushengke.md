### 面试记录 - 2025-10-16 - 百图生科

#### 第一题：React 常见的优化手段有哪些？

这是一个非常经典的问题，考察的是对 React 性能瓶颈和解决方案的理解。React 本身很快，但其核心痛点在于 **不必要的重新渲染 (re-render)**。因此，绝大部分优化手段都是围绕“如何避免无效的渲染”来展开的。

我可以将优化手段分为以下几个方面：

##### 一、 避免不必要的组件渲染

这是最核心、最常见的优化方向。

1.  **`React.memo()`**：
    *   **用途**：用高阶组件包裹一个**函数组件**，对它的 `props` 进行浅比较。只有当 `props` 发生变化时，该组件才会重新渲染。
    *   **场景**：适用于那些 props 相对稳定，但父组件频繁 re-render 的场景。比如一个纯展示性的用户信息卡片。

2.  **`useCallback()`**：
    *   **用途**：用于 memoize (缓存) **函数**。在父组件中，如果一个函数作为 prop 传递给子组件，每次父组件 re-render 都会创建一个新的函数实例，导致子组件（即使被 `React.memo` 包裹）也会重新渲染。`useCallback` 会返回一个缓存的函数版本，只有当它的依赖项改变时，函数才会重新创建。
    *   **场景**：将事件处理函数等作为 prop 传递给被 `React.memo` 优化的子组件时。

3.  **`useMemo()`**：
    *   **用途**：用于 memoize (缓存) **计算结果值**。它会执行一个函数并缓存其结果，只有当依赖项改变时，才会重新计算。
    *   **场景**：当组件中有一些开销很大的计算（比如对一个大数组进行过滤和排序），并且这个计算的依赖不经常变化时，用 `useMemo` 可以避免每次渲染都重复执行这些昂贵的计算。

##### 二、 列表渲染优化

1.  **使用稳定且唯一的 `key`**：
    *   **原理**：`key` 是 React Diff 算法的“身份证”。React 通过 `key` 来识别列表中的每个元素，从而在数据变化时，能够高效地进行移动、删除或新增操作，而不是销毁和重建 DOM 节点。
    *   **最佳实践**：
        *   **永远不要使用 `index` 作为 `key`**，尤其是在列表会发生排序、新增、删除的情况下。这会导致 state 混乱和性能问题。
        *   使用数据中具有唯一性的 ID (如 `item.id`) 作为 `key`。

2.  **虚拟列表 / 窗口化 (Virtualization / Windowing)**：
    *   **用途**：当需要渲染成百上千条数据的长列表时，如果一次性全部渲染，会创建大量 DOM 节点，导致严重的性能问题。
    *   **原理**：只渲染当前视口（Viewport）内可见的列表项，以及上下少量缓冲区。随着用户滚动，动态地更新和回收列表项。
    *   **实现**：通常借助第三方库，如 `react-window` 或 `react-virtualized`。

##### 三、 应用加载性能优化

1.  **代码分割 (Code Splitting) 与懒加载 (Lazy Loading)**：
    *   **用途**：默认情况下，像 Webpack 这样的打包工具会将所有代码打包成一个大的 `bundle.js` 文件。代码分割可以将这个大文件拆分成多个小块（chunks）。
    *   **实现**：使用 `React.lazy()` 和 `Suspense`。`React.lazy` 可以让你像渲染普通组件一样渲染一个动态导入的组件。`Suspense` 组件可以在懒加载组件正在加载时，显示一个 fallback UI（如加载指示器）。
    *   **场景**：常用于基于路由的代码分割，用户访问某个路由时，才加载该路由对应的组件代码。

2.  **分析打包体积 (Bundle Size)**：
    *   **用途**：有时候性能问题是由于引入了过大的第三方库导致的。
    *   **实现**：使用 `webpack-bundle-analyzer` 或 `source-map-explorer` 等工具，可以直观地看到打包文件中各个模块的大小，从而进行针对性优化，比如替换成更轻量的库。

##### 四、 状态管理与数据结构优化

1.  **状态下放 (State Colocation)**：
    *   **原则**：将 state 尽可能地放在最需要它的组件内部，而不是无脑地提升到顶层组件。
    *   **好处**：当 state 变化时，只会影响到该 state 所在的组件及其子组件，避免了不相关组件的 re-render。

2.  **避免在 render 中创建新对象或函数**：
    *   **反模式**：`<div style={{ color: 'red' }}>` 或 `onClick={() => console.log('hi')}`。
    *   **问题**：每次渲染都会创建一个新的对象或函数引用，这会导致子组件的 `props` 检查失效，即使内容没变也会 re-render。
    *   **解决方案**：对于对象，使用 `useMemo`；对于函数，使用 `useCallback`。

---

### 第二题：如果不用 Redux/MobX，如何用原生 JS 设计并手写一个全局状态管理库？

这是一个非常深入的好问题，它考察了对前端状态管理核心思想的理解。要实现一个类似 Redux 的状态管理库，核心是解决 **状态共享** 和 **状态变更的可预测性** 这两大问题。

以下是我的设计思路和实现蓝图：

#### 一、 核心设计理念

我会遵循 Redux 的三大原则来构建我的系统：

1.  **单一数据源 (Single Source of Truth)**：
    *   整个应用的全局状态存储在一个 **单一的、集中的对象** 中，我们称之为 `store`。
    *   **设计实现**：用一个闭包来维护一个 `state` 变量，确保它不能被外部直接修改，只能通过我们提供的 API 来操作。

2.  **State 是只读的 (State is Read-Only)**：
    *   唯一改变 state 的方法就是触发一个 **`action`**。`action` 是一个描述“发生了什么”的普通 JavaScript 对象。
    *   **设计实现**：我们将创建一个 `dispatch(action)` 方法。这是唯一允许“写入”操作的入口。组件不能直接修改 `state`，只能通过 `dispatch` 一个 `action` 来表达修改意图。

3.  **使用纯函数来执行修改 (Changes are made with pure functions)**：
    *   为了描述 `action` 如何改变 `state`，我们需要编写 **`reducers`**。Reducer 是一个纯函数，它接收前一个 `state` 和一个 `action`，然后返回下一个 `state`。即 `(previousState, action) => newState`。
    *   **设计实现**：我们的核心 `dispatch` 方法内部会调用用户提供的 `reducer` 函数，用它的返回值来更新内部的 `state`。

#### 二、 API 设计 - 我们需要提供哪些方法？

基于上述理念，我们的库需要向外暴露一个 `createStore` 工厂函数，它会返回一个 `store` 对象，这个对象上应该有以下几个核心方法：

1.  `createStore(reducer, initialState)`:
    *   这是我们库的入口。它接收一个 `reducer` 函数和可选的 `initialState` 作为参数，负责创建并返回 `store` 对象。

2.  `store.getState()`:
    *   **功能**：获取 `store` 中当前的状态值。
    *   **实现**：直接返回闭包中维护的 `state` 变量。

3.  `store.dispatch(action)`:
    *   **功能**：分发一个 `action`，这是触发 `state` 变更的唯一途径。
    *   **实现**：
        1.  接收一个 `action` 对象。
        2.  调用 `reducer` 函数，传入当前的 `state` 和 `action`，得到新的 `state`。
        3.  用新的 `state` 替换掉旧的 `state`。
        4.  **通知**所有订阅了 `store` 变化的监听者。

4.  `store.subscribe(listener)`:
    *   **功能**：注册一个监听函数 (`listener`)。每当 `state` 发生变化时（即 `dispatch` 被调用后），这个函数就会被执行。
    *   **实现**：
        1.  在 `store` 内部维护一个 `listeners` 数组。
        2.  `subscribe` 方法将传入的 `listener` 函数 `push` 到这个数组中。
        3.  为了能够取消订阅（防止内存泄漏），这个方法应该返回一个 `unsubscribe` 函数。当调用这个返回的函数时，它会把对应的 `listener` 从 `listeners` 数组中移除。

#### 三、 内部实现的关键点梳理

1.  **闭包 (Closure)**：这是实现 `store` 的基石。`createStore` 函数内部的 `state` 变量和 `listeners` 数组对于外部是私有的，只能通过返回的 `getState`, `dispatch`, `subscribe` 方法来访问和操作，这就完美地实现了封装和保护。

2.  **观察者模式 (Observer Pattern)**：`subscribe` 和 `dispatch` 的联动本质上就是观察者模式。
    *   `store` 是“主题”(Subject)。
    *   调用 `subscribe` 的组件是“观察者”(Observer)。
    *   `dispatch` 改变状态后，会遍历 `listeners` 数组并执行所有监听函数，通知所有观察者“数据更新了，你们该刷新视图了”。

#### 四、 工作流程总结

1.  通过 `createStore(reducer)` 创建 `store` 实例。
2.  UI 组件通过 `store.getState()` 读取初始状态并渲染。
3.  UI 组件通过 `store.subscribe(callback)` 注册回调函数，以便在状态更新时得到通知。
4.  用户交互触发 `store.dispatch(action)`。
5.  `dispatch` 内部调用 `reducer` 计算出新 `state` 并覆盖旧 `state`。
6.  `dispatch` 接着调用所有已注册的监听函数。
7.  监听函数触发 UI 组件的重新渲染，组件再次调用 `store.getState()` 获取最新状态，完成界面更新。

---

### 第三题：什么是 CSS 防御性编程 (Defensive CSS)？

CSS 防御性编程是一种 **主动预防** 的编码理念和实践集合。它的核心目标不是仅仅为了实现当前的设计稿，而是要编写出 **健壮、有弹性、可预测** 的 CSS，使得我们的 UI 能够优雅地应对未来可能出现的各种意料之外的情况，比如：

*   **内容变化**：文字太长、太短、没有文字。
*   **容器变化**：组件被放到一个更宽或更窄的容器里。
*   **设备变化**：不同的屏幕尺寸、分辨率和语言方向。

简而言之，防御性 CSS 的思想是：**从“让它看起来没问题”转变为“让它很难被破坏”**。

#### 为什么要进行防御性编程？

在现代 Web 开发中，我们几乎无法控制所有变量：
*   **内容是动态的**：大部分内容来自 CMS、API 或用户输入，我们无法预知其确切长度和格式。
*   **组件是可复用的**：同一个组件可能被用在站点的不同位置、不同布局中。
*   **设计是响应式的**：UI 必须在从手表到巨幕的各种设备上正常工作。

如果不采取防御性措施，一个简单的内容变更就可能导致布局错乱、文字重叠、元素溢出等问题，极大地增加了维护成本。

#### 核心原则与实用技巧

以下是我在实践中常用的一些防御性 CSS 技巧：

##### 1. 处理内容溢出

这是最常见的防御场景，特别是对于文本。

*   **单行文本截断**：
    ```css
    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ```
*   **多行文本截断** (适用于 WebKit 内核浏览器):
    ```css
    .line-clamp {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3; /* 显示 3 行 */
      overflow: hidden;
    }
    ```
*   **长单词或链接换行**：防止超长字符串撑破容器。
    ```css
    .break-word {
      overflow-wrap: break-word; /* 优先在单词间换行 */
      word-break: break-all;     /* 备选：在任意字符间换行 */
    }
    ```

##### 2. 使用灵活的布局和尺寸

避免使用写死的尺寸，拥抱内在尺寸 (Intrinsic Sizing)。

*   **用 `max-width` 代替 `width`**：
    ```css
    /* 防御性做法 */
    .card {
      max-width: 300px; /* 允许收缩，但最大不超过 300px */
    }
    /* 脆弱的做法 */
    .card {
      width: 300px; /* 在小于 300px 的容器里会溢出 */
    }
    ```
*   **让图片自适应**：这是所有项目都应该有的全局规则。
    ```css
    img {
      max-width: 100%;
      height: auto;
      display: block; /* 移除图片底部的额外空间 */
    }
    ```
*   **使用 `auto-fit` 和 `minmax` 创建响应式网格**：让网格布局自动适应容器宽度，无需媒体查询。
    ```css
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    ```

##### 3. 创建稳定的间距

*   **使用 `gap` 属性**：在 Flexbox 和 Grid 布局中，使用 `gap` 来设置子项之间的间距，而不是 `margin`。这样更简单、更可预测，不会有多余的外边距。
    ```css
    .flex-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem; /* 替代 .item + .item { margin-left: 1rem; } */
    }
    ```
*   **流动布局 (Flow Layout)**：对于垂直堆叠的元素，使用“猫头鹰选择器” (`* + *`) 可以确保只有元素之间有 `margin`。
    ```css
    .flow > * + * {
      margin-top: 1.5rem; /* 为所有直接子元素之间添加上外边距 */
    }
    ```

##### 4. 健壮的媒体对象

*   **使用 `object-fit`**：控制图片或视频如何填充其容器，避免被拉伸或压缩。
    ```css
    .avatar {
      width: 100px;
      height: 100px;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* 裁剪以填充，保持宽高比 */
    }
    ```
*   **使用 `aspect-ratio`**：为图片等媒体预留空间，防止页面在加载时发生布局抖动 (Layout Shift)。
    ```css
    .thumbnail {
      aspect-ratio: 16 / 9;
    }
    ```

##### 5. 使用 CSS 自定义属性 (变量)

*   **提供备选值**：当一个 CSS 变量可能不存在时，可以提供一个备选值。
    ```css
    .alert {
      /* 如果 --alert-color 未定义，则使用 red */
      background-color: var(--alert-color, red);
    }
    ```

#### 总结

防御性 CSS 是一种思维模式的转变。它要求我们在编写样式时，多问自己几个“如果...会怎样？”的问题：
*   如果这里的标题有三行长会怎样？
*   如果没有图片会怎样？
*   如果用户的字体设置得非常大会怎样？

通过采纳这些防御性技巧，我们可以构建出更具弹性、更易于维护、用户体验更好的 Web 界面。

---

### 第四题：如何用 CSS 实现一个扇形？

使用纯 CSS 实现扇形有多种方法，主要思路都是先创建一个方形或圆形，然后通过裁剪、旋转或渐变等方式“切”出扇形。以下是几种常见且实用的实现方式。

#### 方法一：利用 `border-radius` 和 `transform` (兼容性最好)

这是最经典、兼容性最好的方法。核心思路是利用一个正方形容器，将其变为圆形，然后用一个矩形（通常是伪元素）在其中旋转，只显示其一部分。

**实现一个 90 度（四分之一圆）的扇形：**

**HTML:**
```html
<div class="sector"></div>
```

**CSS:**
```css
.sector {
  width: 200px;
  height: 200px;
  border-radius: 50%; /* 1. 将容器变为圆形 */
  background-color: #ff6347; /* 扇形的颜色 */
  position: relative;
  overflow: hidden; /* 2. 隐藏超出圆形区域的部分 */
}

.sector::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #eee; /* 用一个颜色块来“遮盖” */
  transform-origin: 100% 100%; /* 3. 设置旋转中心为右下角 */
  
  /* 4. 旋转 -90 度，从而“露出”左上角 90 度的扇形 */
  /* 如果想露出右上角，设置 transform-origin: 0 100% 即可 */
  transform: rotate(-90deg); 
}
```

**原理解析:**
1.  我们创建一个 `200x200` 的正方形，并用 `border-radius: 50%` 把它变成一个红色的圆形。
2.  然后，我们用 `::before` 伪元素创建一个和它一样大的灰色遮罩层。
3.  关键在于 `transform-origin: 100% 100%`，它将遮罩层的旋转中心点设置在了右下角。
4.  当我们对这个遮罩层 `transform: rotate(-90deg)` 时，它就以右下角为圆心，逆时针旋转了 90 度，正好把圆形的左上角四分之一给“露”了出来，形成了扇形。

**优点**:
*   兼容性极好，能兼容到 IE9+。
*   逻辑清晰，容易理解。

**缺点**:
*   实现大于 180 度的扇形会比较复杂，通常需要两个伪元素配合。

#### 方法二：利用 `conic-gradient` (最现代、最简单)

`conic-gradient` (锥形渐变) 是专门用来处理类似饼图、色盘等场景的，用它来实现扇形是最简单直接的。

**实现一个 90 度（四分之一圆）的扇形：**

**HTML:**
```html
<div class="sector-gradient"></div>
```

**CSS:**
```css
.sector-gradient {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  
  /* 
   * 从 0 度到 90 度是番茄红，
   * 从 90 度开始到结尾 (360度) 是透明。
   */
  background: conic-gradient(
    #ff6347 0deg 90deg, 
    transparent 90deg 360deg
  );
}
```

**原理解析:**
锥形渐变就像一个以元素中心为圆心的色轮。我们定义：
*   `#ff6347 0deg 90deg`: 从 0 度角到 90 度角，颜色都是 `#ff6347`。
*   `transparent 90deg 360deg`: 从 90 度角开始，一直到 360 度，颜色都是透明。
这样就直接“画”出了一个 90 度的扇形。

**优点**:
*   代码极其简洁，语义化最强。
*   修改角度非常方便，实现任意角度的扇形都只需要改一个数值。

**缺点**:
*   属于较新的 CSS 特性，在一些老旧浏览器上不被支持。

#### 方法三：利用 `clip-path`

`clip-path` 属性可以创建一个裁剪区域，只有区域内的部分才会显示。我们可以用 `polygon()` 函数来定义一个三角形的裁剪区域。

**实现一个等腰直角三角形扇形 (45度):**

**HTML:**
```html
<div class="sector-clip"></div>
```

**CSS:**
```css
.sector-clip {
  width: 200px;
  height: 200px;
  background-color: #ff6347;

  /* 
   * 定义一个多边形裁剪路径：
   * 0% 0%      -> 左上角顶点
   * 100% 0%     -> 右上角顶点
   * 0% 100%     -> 左下角顶点
   * 这三个点连起来形成一个三角形
   */
  clip-path: polygon(0% 0%, 100% 0%, 0% 100%);
}
```
如果要实现一个“圆角”的扇形，需要配合 `border-radius`，但 `clip-path` 会在 `border-radius` 之后应用，所以需要将 `clip-path` 应用在一个方形父元素上，子元素设置 `border-radius`。不过这种方式较为复杂，不如前两种直接。

**总结**：
*   追求 **最佳兼容性**，选择 **方法一 (`transform`)**。
*   追求 **代码简洁和现代性**，且不考虑老旧浏览器，选择 **方法二 (`conic-gradient`)**。
*   如果需要创建 **非标准角度或多边形** 的扇形，`clip-path` 是一个强大的备选方案。
