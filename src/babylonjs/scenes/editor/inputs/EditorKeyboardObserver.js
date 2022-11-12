import { KeyboardEventTypes } from '@babylonjs/core';

export class EditorKeyboardObserver {
  constructor(actions) {
    this._scene = null;
    this._actions = actions;
    this._keystrokes = { modifer: null, key: null };
    this._observer = null;
  }

  attachScene(scene) {
    if (this._observer) this._scene.onKeyboardObservable.remove(this._observer);
    this._scene = scene;
    this._observer = _editorKeyboardObserver(scene);
  }

  _editorKeyboardObserver(scene) {
    const keyboardObserver = scene.onKeyboardObservable.add((kbInfo) => {
      let key = kbInfo.event.key;
      if (kbInfo.type == KeyboardEventTypes.KEYDOWN) {
        if (['Control', 'Shift', 'Meta'].includes(key)) {
          this._keystrokes.modifier = key;
        } else {
          this._keystrokes.key = key;
        }
        let actionPayload = this._processKbInput(
          this._kbInput,
          this._actions.state
        );
        if (actionPayload) {
          this._actions.process(actionPayload);
        }
      } else if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYUP) {
        if (['Control', 'Shift', 'Meta'].includes(key)) {
          this._kbInput.modifier = null;
        } else {
          this._kbInput.key = null;
        }
      }
    });
    return keyboardObserver;
  }

  _processKbInput(kbInput, actionState) {
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

    let payload = null;
    switch (input) {
      case 'g':
        payload = { action: 'grab' };
        break;

      case 'x':
        if (actionState.action == 'move')
          payload = { action: 'move', modifier: 'x' };
        if (actionState.action == 'scale')
          payload = { action: 'scale', modifier: 'x' };
        if (actionState.action == 'rotate')
          payload = { action: 'rotate', modifier: 'x' };
        break;

      case 'y':
        if (actionState.action == 'move')
          payload = { action: 'move', modifier: 'y' };
        if (actionState.action == 'scale')
          payload = { action: 'scale', modifier: 'y' };
        if (actionState.action == 'rotate')
          payload = { action: 'rotate', modifier: 'y' };
        break;

      case 'z':
        if (actionState.action == 'move')
          payload = { action: 'move', modifier: 'z' };
        if (actionState.action == 'scale')
          payload = { action: 'scale', modifier: 'z' };
        if (actionState.action == 'rotate')
          payload = { action: 'rotate', modifier: 'z' };
        break;

      case 'j':
        payload = { action: 'joint', selector: 'joint' };
        break;

      case 'Control+z':
        payload = { action: 'undo' };
        break;

      case 'Meta+z':
        payload = { action: 'undo' };
        break;
    }

    return payload;
  }
}
