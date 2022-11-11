export class EditorInputs {
  constructor(actions) {
    this._actions = actions;
    this.pointerObserver = new EditorPointerObserver(actions);
    this.keyboardObserver = new EditorKeyboardObserver(actions);
  }

  attachScene(scene) {
    this.pointerObserver.attachScene(scene);
    this.keyboardObserver.attachScene(scene);
  }

  process(input) {
    this._actions.process(input);
  }
}
