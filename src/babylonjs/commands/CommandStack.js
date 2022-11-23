export default class ComandStack {
  constructor() {
    this._stack = [];
    this._stackUndo = [];
    this.maxStackSize = 20;
  }

  execute(command) {
    command.execute();
    this._stack.push(command);
    this.limitStack(this._stack);
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
