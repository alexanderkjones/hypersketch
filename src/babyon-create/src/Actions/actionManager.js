import { store, stack } from "../Globals";
import * as MeshActions from "./MeshActions";
import { actionManagerConfig } from "./actionManager.config";
import { ActionManagerKeyboardInput, ActionManagerPointersInput } from "./Inputs";

export class ActionManager {
  constructor() {
    this._scene = null;
    this._enabled = null;
    this._actions = {};
    this._watchStore();
    this._registerActions();
    this._keyboardInput = new ActionManagerKeyboardInput(actionManagerConfig.keyboardMapping);
    this._pointersInput = new ActionManagerPointersInput();
  }

  _watchStore() {
    store.watch("attachedScene", this, (scene) => {
      this._scene = scene;
    });
    store.watch("actionRequest", this, this._onSetActionRequest);
  }

  _registerActions() {
    for (const key in MeshActions) {
      const Action = MeshActions[key];
      this.register(Action.name, Action);
    }
  }

  registerAction(key, _class) {
    const action = { _class: _class, instance: null, enabled: false };
    this._actions[key] = action;
  }

  _actionEnabled(key, enabled) {
    const action = this.actions[key];
    if (enabled) {
      if (!(key == this._enabled)) {
        this.actions[this._enabled].instance.dispose();
        delete this.actions[this._enabled].instance;
      }
      if (!action.instance) {
        action.instance = new action._class();
      }
      this._enabled = key;
      store.set("actionEnabled", key);
    } else {
      delete this.actions[this._enabled].instance;
      this._enabled = null;
      store.set("actionEnabled", key);
    }
    action.enabled = enabled;
  }

  _onSetActionRequest = (request) => {
    if (!request) {
      return;
    }
    const { action, argument, value } = request;
    if (!action) {
      throw new Error("actionRequest must contain a target action key");
    }
    if (!(action in this.actions)) {
      throw new Error(action + " is not a registered action");
    }
    if (!argument) {
      throw new Error("actionRequest must have an 'argument' property");
    }
    if (!value) {
      throw new Error("actionRequest must have an 'value' property");
    }
    this._actionEnabled(action, true);
    this.actions[action].process(request);
  };
}
