class OperationHistory {
  constructor() {
    // 操作历史栈
    this.undoStack = [];
    // 重做栈
    this.redoStack = [];
    // 最大记录数量（可选）
    this.maxHistory = 20;
  }

  // 执行新操作
  execute(command) {
    // 执行命令
    command.execute();
    // 将命令推入撤销栈
    this.undoStack.push(command);
    // 清空重做栈
    this.redoStack = [];

    // 控制历史记录数量
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
  }

  // 撤销操作
  undo() {
    if (this.undoStack.length === 0) return false;

    // 从撤销栈中取出最后一个命令
    const command = this.undoStack.pop();
    // 执行撤销
    command.undo();
    // 将命令推入重做栈
    this.redoStack.push(command);

    return true;
  }

  // 重做操作
  redo() {
    if (this.redoStack.length === 0) return false;

    // 从重做栈中取出最后一个命令
    const command = this.redoStack.pop();
    // 重新执行命令
    command.execute();
    // 将命令推入撤销栈
    this.undoStack.push(command);

    return true;
  }

  // 清空历史
  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}

// 命令基类
class Command {
  execute() {}
  undo() {}
}



// 使用示例:

// 文本编辑命令
class TextCommand extends Command {
  constructor(editor, oldText, newText) {
    super();
    this.editor = editor;
    this.oldText = oldText;
    this.newText = newText;
  }

  execute() {
    this.editor.content = this.newText;
  }

  undo() {
    this.editor.content = this.oldText;
  }
}

// 简单的编辑器类
class Editor {
  constructor() {
    this.content = '';
    this.history = new OperationHistory();
  }

  // 更新内容
  updateContent(newText) {
    const command = new TextCommand(this, this.content, newText);
    this.history.execute(command);
  }

  // 撤销
  undo() {
    return this.history.undo();
  }

  // 重做
  redo() {
    return this.history.redo();
  }
}

// 文本编辑器示例
const editor = new Editor();

editor.updateContent('Hello'); // content: 'Hello'
console.log(editor.content);
editor.updateContent('Hello World'); // content: 'Hello World'
console.log(editor.content);
editor.undo(); // content: 'Hello'
console.log(editor.content);
editor.redo();
console.log(editor.content);
