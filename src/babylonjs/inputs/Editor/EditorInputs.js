export class EditorInputs{
  constructor(state, actions){
    this.editorState = state;
    this.editorActions = actions;
  }

  attachScene(scene){
    this.pointerObserver = new EditorPointerObserver(scene, this.editorState);
    this.keyboardObserver = new EditorKeyboardObserver(scene, this.editorState, this.editorActions);
    this.UIObserver = new EditorUIObserver(scene, this.editorState, this.editorActions);
  }

  

  _inputKeyboardObserver = (scene) => {
    const keyboardObserver = scene.onKeyboardObservable.add((kbInfo) => {
      let key = kbInfo.event.key;
      if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN) {
        if (['Control', 'Shift', 'Meta'].includes(key)) {
          this._kbInput.modifier = key;
        } else {
          this._kbInput.key = key;
        }
        this._processKbInput(this._kbInput, this._mode, this.processInput);
      } else if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP) {
        if (['Control', 'Shift', 'Meta'].includes(key)) {
          this._kbInput.modifier = null;
        } else {
          this._kbInput.key = null;
        }
      }
    });
    return keyboardObserver;
  };

}