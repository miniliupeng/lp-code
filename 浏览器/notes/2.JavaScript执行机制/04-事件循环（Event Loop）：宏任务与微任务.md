# 04-事件循环（Event Loop）：宏任务与微任务

事件循环（Event Loop）是 JavaScript 解决单线程运行阻塞问题的核心机制，也是其异步编程模型的基石。要理解事件循环，我们首先需要了解几个关键的概念：调用栈、任务队列和事件循环本身的工作流程。

## 1. 核心组件

### a. 调用栈 (Call Stack)

JavaScript 是一门单线程语言，这意味着它只有一个**调用栈**。调用栈是一个后进先出（LIFO）的数据结构，用于存储和管理函数调用。

*   当一个函数被调用时，它会被推入（push）到调用栈的顶部。
*   当函数执行完毕并返回时，它会从调用栈的顶部被弹出（pop）。
*   所有同步代码都会在调用栈中依次执行。

```javascript
function third() {
  console.log('Third');
}
function second() {
  third();
}
function first() {
  second();
}
first();

// 调用栈变化过程:
// 1. first() 入栈
// 2. second() 入栈
// 3. third() 入栈
// 4. third() 执行完毕, 出栈
// 5. second() 执行完毕, 出栈
// 6. first() 执行完毕, 出栈
```

### b. Web APIs

对于异步操作，例如 `setTimeout`, `fetch` 请求或 DOM 事件监听，JS 引擎并不会自己处理。它会将这些任务交给**浏览器**提供的相应模块（Web APIs），例如定时器模块、网络模块等。这些模块通常在单独的线程中运行，因此不会阻塞 JS 主线程。

### c. 任务队列 (Task Queue / Callback Queue)

当 Web API 完成了它的任务（比如定时器时间到了，或者网络请求收到了响应），它并不会直接将结果返回给 JS 主线程，而是将需要执行的**回调函数**放入一个**任务队列**中。

任务队列是一个先进先出（FIFO）的数据结构，它存放着所有待处理的异步任务。

## 2. 宏任务 (Macrotask) 与 微任务 (Microtask)

任务队列并非只有一个。根据任务类型的不同，它被分为两种：

### a. 宏任务队列 (Macrotask Queue)

*   **定义**：宏任务通常代表一个独立的、离散的工作单元。
*   **常见的宏任务**：
    *   `setTimeout`, `setInterval`
    *   `script` (整体代码块)
    *   I/O 操作（如网络请求 `fetch` 的回调）
    *   UI 渲染（在某些标准中被视为宏任务）
    *   DOM 事件监听回调

### b. 微任务队列 (Microtask Queue)

*   **定义**：微任务通常是需要在**当前任务执行之后、下一个宏任务开始之前**立即执行的短小任务。它们通常用于处理 `Promise` 的决议或执行一些需要在 DOM 更新前完成的清理工作。
*   **常见的微任务**：
    *   `Promise.then()`, `Promise.catch()`, `Promise.finally()`
    *   `async/await`（`await` 后面的代码实际上是 `Promise.then` 的语法糖）
    *   `MutationObserver`
    *   `queueMicrotask()`

## 3. 事件循环 (Event Loop) 的工作流程

事件循环是一个持续不断的过程，它的基本工作就是反复检查调用栈和任务队列，并根据规则移动函数以供执行。

其核心算法可以描述如下：

1.  **执行一个宏任务**：从宏任务队列中取出一个最旧的任务来执行。在第一次加载页面时，这个任务就是全局的 `<script>` 代码块。
2.  **检查调用栈**：执行该宏任务中的所有同步代码，直到调用栈为空。
3.  **执行所有微任务**：检查微任务队列。只要微任务队列不为空，就循环地取出队列头部的微任务来执行，直到**整个微任务队列被清空**。
    *   **注意**：如果在执行微任务的过程中，又产生了新的微任务，那么这些新的微任务也会被添加到队列的末尾，并在这个阶段被立即执行。
4.  **UI 渲染 (可选)**：在执行完所有微任务后，浏览器可能会进行一次 UI 渲染（重绘/回流）。这个步骤不是每次事件循环都发生，而是由浏览器根据性能和时机来决定。
5.  **返回步骤 1**：结束当前的循环，回到步骤 1，准备从宏任务队列中取出下一个任务，开始新的循环。

这个 "取一个宏任务 -> 执行所有微任务 -> (可能)渲染" 的过程，就是一次事件循环的 "tick"。

## 4. 示例分析

让我们通过一个经典的例子来理解这个流程：

```javascript
console.log('script start'); // 1

setTimeout(function() {
  console.log('setTimeout'); // 5
}, 0);

Promise.resolve().then(function() {
  console.log('promise1'); // 3
}).then(function() {
  console.log('promise2'); // 4
});

console.log('script end'); // 2
```

**执行过程分析**：

1.  **宏任务 #1 (script)**:
    *   `console.log('script start')` 被执行，输出 "script start"。
    *   遇到 `setTimeout`，将其回调函数注册为一个新的**宏任务**，放入宏任务队列。
    *   遇到 `Promise.resolve().then()`，第一个 `.then` 的回调被注册为一个**微任务**，放入微任务队列。
    *   `console.log('script end')` 被执行，输出 "script end"。
    *   至此，第一个宏任务（全局脚本）中的同步代码执行完毕。

2.  **执行微任务**:
    *   事件循环检查微任务队列，发现不为空。
    *   取出第一个微任务 (`promise1` 的回调) 并执行，输出 "promise1"。
    *   执行过程中，`promise1` 返回 `undefined`，并触发了链式调用的第二个 `.then`，因此一个新的微任务 (`promise2` 的回调) 被放入微任务队列。
    *   事件循环再次检查微任务队列，发现仍然不为空。
    *   取出第二个微任务 (`promise2` 的回调) 并执行，输出 "promise2"。
    *   微任务队列现在为空。

3.  **(可选) UI 渲染**: 浏览器可能会在此时进行渲染。

4.  **宏任务 #2 (setTimeout)**:
    *   事件循环从宏任务队列中取出 `setTimeout` 的回调任务。
    *   执行该任务，输出 "setTimeout"。

**最终输出顺序**: `script start` -> `script end` -> `promise1` -> `promise2` -> `setTimeout`。
