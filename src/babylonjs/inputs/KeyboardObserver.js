import { KeyboardEventTypes } from "@babylonjs/core";
import { store } from "babylonjs/globals";

export default class KeyboardObserver {
  constructor(config) {
    this._scene = null;
    this._config = config;
    this._keystrokes = { modifiers: { control: false, option: false, alt: false, shift: false, command: false, meta: false }, key: null };
    this._observer = null;
    this._watchStore();
  }

  _watchStore() {
    store.watch("attachedScene", this, this._onSetAttachedScene);
  }

  _onSetAttachedScene = (scene) => {
    if (!scene) {
      return;
    }
    if (this._observer) {
      this._scene.onKeyboardObservable.remove(this._observer);
    }
    this._scene = scene;
    this._observer = this._keyboardObserver(scene);
  };

  _keyboardObserver(scene) {
    const keyboardObserver = scene.onKeyboardObservable.add((kbInfo) => {
      const key = kbInfo.event.key.toLowerCase();
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          if (key in this._keystrokes.modifiers) {
            this._keystrokes.modifiers[key] = true;
          } else {
            this._keystrokes.key = key;
          }
          const request = this._processKeys();
          if (request) {
            store.set("actionRequest", request);
          }
          break;
        case KeyboardEventTypes.KEYUP:
          if (key in this._keystrokes.modifiers) {
            this._keystrokes.modifiers[key] = false;
          } else {
            this._keystrokes.key = null;
          }
          break;
      }
      return keyboardObserver;
    });
  }

  _processKeys() {
    const keys = this._mergeKeys();
    const action = store.get("actionEnabled");

    let request = null;
    if (action in this._config.keyboardShortcuts) {
      request = this._config.keyboardShortcuts[action][keys];
    } else {
      request = this._config.keyboardShortcuts.default[keys];
    }

    return request;
  }

  _mergeKeys() {
    let keys = "";
    for (let key in this._keystrokes.modifiers) {
      if (this._keystrokes.modifiers[key]) {
        if (keys.length > 0) {
          keys += "+";
        }
        keys += key;
      }
    }
    if (this._keystrokes.key) {
      if (keys.length > 0) {
        keys += "+";
      }
      keys += this._keystrokes.key;
    }
    return keys;
  }

  _clearKeys() {
    for (let key in this._keystrokes.modifiers) {
      this._keystrokes.modifiers[key] = false;
      this._keystrokes.key = null;
    }
  }
}
