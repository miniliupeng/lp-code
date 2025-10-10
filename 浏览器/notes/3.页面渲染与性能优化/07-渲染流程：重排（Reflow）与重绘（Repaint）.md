# 07-渲染流程：重排（Reflow）与重绘（Repaint）

我们在“关键渲染路径”一章中已经了解了浏览器渲染页面的基本流程：`构建渲染树 -> 布局(Layout) -> 绘制(Paint)`。**重排（Reflow）** 和 **重绘（Repaint）** 就是在这个流程中，当页面元素的样式或结构发生变化时，浏览器需要重新执行的步骤。它们是影响前端性能的关键因素。

## 1. 概念定义

### a. 重排 (Reflow)

*   **定义**：当 DOM 的**几何属性**（如宽度、高度、位置、边距等）发生变化，导致浏览器需要**重新计算元素的几何信息**，并重新构建页面布局的过程，就称为重排。
*   **等同术语**：在现代浏览器中，重排也被称为**布局（Layout）**。
*   **核心**：任何会改变元素在文档流中**位置**和**尺寸**的操作，都可能触发重排。

### b. 重绘 (Repaint)

*   **定义**：当 DOM 的**外观属性**（如颜色、背景、阴影等）发生变化，但**不影响其几何属性**时，浏览器需要**重新将元素绘制到屏幕上**的过程，就称为重绘。
*   **等同术语**：重绘也被称为**绘制（Paint）**。
*   **核心**：只改变视觉效果，不改变布局。

## 2. 关系：重排必定导致重绘

**重排（Reflow）的成本远高于重绘（Repaint）**。

可以这样理解它们的关系：
1.  你决定给房间里的沙发**换个位置**（重排）。
2.  为了完成这个操作，你不仅需要重新规划房间的整体布局，而且沙发原来的位置和新位置的地板都需要**重新打扫一遍**（重绘）。

因此，**一次重排必定会触发一次重绘**，因为元素的几何位置都变了，浏览器必须重新把它画出来。反之，**一次重绘不一定会触发重排**，比如你只是给沙发换了个颜色的套子，房间的布局并未改变。

## 3. 触发条件

### a. 触发重排 (Reflow) 的常见操作

*   **页面首次渲染**：这是最大规模的一次重排。
*   **添加或删除可见的 DOM 节点**。
*   **元素尺寸或位置的改变**：修改 `width`, `height`, `margin`, `padding`, `border`, `left`, `top` 等属性。
*   **内容改变**：例如，文本数量的增减、图片大小的改变，导致元素尺寸变化。
*   **浏览器窗口尺寸改变（resize）**。
*   **获取布局信息**：这是一个非常关键且容易被忽略的点。当你读取某些需要即时计算的 DOM 属性时，浏览器为了返回最精确的值，会强制提前执行布局流程。
    *   常见的属性包括：`offsetTop`, `offsetLeft`, `offsetWidth`, `offsetHeight`, `scrollTop`, `scrollLeft`, `scrollWidth`, `scrollHeight`, `clientTop`, `clientLeft`, `clientWidth`, `clientHeight`。
    *   调用 `getComputedStyle()` 或 `getBoundingClientRect()` 方法。

### b. 仅触发重绘 (Repaint) 的常见操作

*   修改 `color`, `background-color`, `border-color`, `outline-style`, `visibility`, `text-decoration` 等不影响几何布局的样式。

## 4. 浏览器优化策略：渲染队列

考虑到频繁的重排和重绘会严重影响性能，现代浏览器实现了一套**渲染队列（Render Queue）**机制来进行优化。

*   **机制**：当你的代码触发了重排或重绘时，浏览器并不会立即执行，而是将这个“待处理”的变更放入一个队列中。浏览器会继续执行后续的 JS 代码。
*   **批量执行**：浏览器会等到一个合适的时机（比如当前 JS 代码块执行完毕，或者队列中的变更积累到一定程度），然后**一次性地**将队列中的所有变更批量处理掉，这样多次的重排/重绘就有可能被合并为一次。

**但是**，正如上面提到的，如果你在代码中**读取了需要即时计算的布局属性**，就会破坏这个优化机制。浏览器为了给你返回最准确的值，不得不**强制清空渲染队列**，立即执行一次重排/重绘。

**一个反面教材：**
```javascript
const elements = document.querySelectorAll('.box');
elements.forEach(el => {
  // 每次循环都强制浏览器重排，因为要读取 offsetWidth
  el.style.width = el.offsetWidth + 10 + 'px';
});
```
这个循环有 N 个元素，就会导致 N 次重排，性能极差。

## 5. 如何优化：减少重排和重绘

1.  **样式集中改变**：
    *   避免逐条修改样式，而是通过切换 CSS class 或使用 `cssText` 属性一次性修改。
    ```javascript
    // 不推荐
    el.style.width = '100px';
    el.style.height = '100px';
    el.style.margin = '10px';

    // 推荐
    el.className += ' new-style'; // 或者 el.classList.add('new-style')
    // 或者
    el.style.cssText = 'width: 100px; height: 100px; margin: 10px;';
    ```

2.  **批量操作 DOM**：
    *   当需要对 DOM 进行多次操作时，使用 `DocumentFragment` 作为临时容器，在内存中完成所有修改，然后一次性地将其添加到真实 DOM 中。
    *   或者，可以先将元素 `display: none`，对其进行多次修改后，再恢复显示。

3.  **避免强制同步布局**：
    *   在修改样式后，避免立即读取会触发重排的属性。可以先将需要读取的值缓存到一个变量中。
    ```javascript
    // 优化版
    const elements = document.querySelectorAll('.box');
    const widths = [];
    elements.forEach(el => widths.push(el.offsetWidth)); // 先统一读
    elements.forEach((el, i) => {
      el.style.width = widths[i] + 10 + 'px'; // 再统一写
    });
    ```

4.  **使用 `transform` 和 `opacity` 实现动画**：
    *   这两个属性的改变通常可以被浏览器优化，仅触发**合成（Composite）**，而跳过重排和重绘。这会利用 GPU 加速，是实现流畅动画的首选方案。

5.  **使用 `will-change` 属性**：
    *   提前告知浏览器某个元素即将发生变换，让浏览器可以提前为其创建独立的图层，优化性能。但应谨慎使用，避免滥用。
