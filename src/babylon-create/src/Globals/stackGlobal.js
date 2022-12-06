class Stack {
  constructor() {
    this._stack = [];
    this._stackUndo = [];
    this.maxStackSize = 20;
  }
  execute(command) {
    let result = null;
    if (!command.executed) {
      result = command.execute();
    }
    this._stack.push(command);
    this.limitStack(this._stack);
    return result;
  }

  undo() {
    if (!this._stack.length) {
      return;
    }
    const command = this._stack.pop();
    command.undo();
    this._stackUndo.push(command);
    this.limitStack(this._stackUndo);
  }

  redo() {
    if (!this._stackUndo.length) {
      return;
    }
    const command = this._stackUndo.pop();
    this.execute(command);
  }

  limitStack(stack) {
    if (stack.length > this.maxStackSize) {
      stack.shift();
    }
  }
}

export const stack = new Stack();
