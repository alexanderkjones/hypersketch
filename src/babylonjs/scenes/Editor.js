export class Editor {
  constructor() {}

  initialize(scene) {
    this._scene = scene;
    this._attachedMesh = null;
    this._ignoredMeshes = [];

    this._kbInput = {
      key: null,
      modifier: null,
    };

    this._mode = {
      selector: null,
      action: null,
      modifier: null,
      value: null,
    };
    this.state = new EditorState();
    this.actions = new EditorActions();
    this.input = new EditorInputs(this.state, this.actions);
    this.keyboardObserver = new EditorKeyboardObserver(scene, this.state);
    this.pointerObserver = new EditorPointerObserver(scene);

    const inputKeyboardObserver = this._inputKeyboardObserver(scene);
    const attachToMeshPointerObserver =
      this._attachToMeshPointerObserver(scene);
    this._observers = [inputKeyboardObserver, attachToMeshPointerObserver];
  }

  attachScene(scene) {
    this.state.attachScene(scene);
    this.actions.attachScene(scene);
    this.inputs.attachScene(scene);
  }

  _processKbInput(kbInput, currentState, processInput) {
    if (!kbInput.modifier && !kbInput.key) {
      return;
    }

    let input = '';
    if (kbInput.modifier && kbInput.key) {
      input += kbInput.modifer + '+' + kbInput.key;
    } else if (kbInput.modifier) {
      input += kbInput.modifier;
    } else if (kbInput.key) {
      input += kbInput.key;
    }

    switch (keys) {
      case 'g':
        processInput({ action: 'grab' });
        break;

      case 'x':
        if (currentState.action == 'move')
          processInput({ action: 'move', modifier: 'x' });
        if (currentState.action == 'scale')
          processInput({ action: 'scale', modifier: 'x' });
        if (currentState.action == 'rotate')
          processInput({ action: 'rotate', modifier: 'x' });
        break;

      case 'y':
        if (currentState.action == 'move')
          processInput({ action: 'move', modifier: 'y' });
        if (currentState.action == 'scale')
          processInput({ action: 'scale', modifier: 'y' });
        if (currentState.action == 'rotate')
          processInput({ action: 'rotate', modifier: 'y' });
        break;

      case 'z':
        if (currentState.action == 'move')
          processInput({ action: 'move', modifier: 'z' });
        if (currentState.action == 'scale')
          processInput({ action: 'scale', modifier: 'z' });
        if (currentState.action == 'rotate')
          processInput({ action: 'rotate', modifier: 'z' });
        break;

      case 'j':
        processInput({ action: 'joint', selector: 'joint' });
        break;

      case 'Control+z':
        processInput({ action: 'undo' });
        break;

      case 'Meta+z':
        processInput({ action: 'undo' });
        break;
    }
  }

  processInput(input) {
    // Actions
    if (input.action != this._mode.action) {
      this.clearActions();
      switch (input.action) {
        case 'grab':
          this.grabActionEnabled(true);
          break;
        case 'move':
          this.moveActionEnabled(true);
          break;
        case 'scale':
          this.scaleActionEnabled(true);
          break;
        case 'rotate':
          this.rotateActionEnabled(true);
          break;
        case 'join':
          this.jointActionEnabled(true);
          break;
      }
      this._mode.modifier = null;
    }

    // Modifiers
    if (input.modifier != this._mode.modfier) {
      switch (input.modifier) {
        case 'x':
          if (currentState.action == 'move')
            this.actions.moveActionEnabled(true, 'x');
          if (currentState.action == 'scale')
            this.actions.scaleActionEnabled(true, 'x');
          if (currentState.action == 'rotate')
            this.actions.rotateActionEnabled(true, 'x');
          break;
        case 'y':
          if (currentState.action == 'move')
            this.actions.moveActionEnabled(true, 'y');
          if (currentState.action == 'scale')
            this.actions.scaleActionEnabled(true, 'y');
          if (currentState.action == 'rotate')
            this.rotateActionEnabled(true, 'y');
          break;
        case 'z':
          if (currentState.action == 'move') this.moveActionEnabled(true, 'z');
          if (currentState.action == 'scale')
            this.scaleActionEnabled(true, 'z');
          if (currentState.action == 'rotate')
            this.rotateActionEnabled(true, 'z');
          break;
      }
    }

    // Values
    if (input.value) {
      switch (this._mode.action) {
        case 'move':
          this.actions.moveAction.value(input.value);
          break;
        case 'scale':
          this.actions.scaleAction.value(input.value);
          break;
        case 'rotate':
          this.actions.rotateAction.value(input.value);
          break;
        case 'extrude':
          this.actions.extrudeAction.value(input.value);
          break;
      }
    }
  }
}
