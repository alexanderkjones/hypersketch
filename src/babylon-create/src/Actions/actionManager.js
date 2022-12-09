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
      const actionNameString = Action.name;
      const name = Action.name[0].toLowerCase() + Action.name.slice(1, Action.name.lastIndexOf("Action"));
      this.registerAction(name, Action);
    }
  }

  registerAction(key, _class) {
    const action = { _class: _class, instance: null, enabled: false };
    this._actions[key] = action;
  }

  _actionEnabled(key, enabled) {
    const action = this._actions[key];
    if (enabled) {
      if (this._enabled && key != this._enabled) {
        if (this._actions[this._enabled].instance) {
          this._actions[this._enabled].instance.dispose();
          delete this._actions[this._enabled].instance;
        }
      }
      if (!action.instance) {
        action.instance = new action._class();
      }
      this._enabled = key;
      store.set("actionEnabled", key, "actionManager");
    } else {
      delete this._actions[this._enabled].instance;
      this._enabled = null;
      store.set("actionEnabled", key, "actionManager");
    }
    action.enabled = enabled;
  }

  _onSetActionRequest = (request) => {
    console.log(request);
    if (!request) {
      return;
    }

    const { action, argument, value } = request;
    if (!action) {
      throw new Error("actionRequest must contain a target action key");
    }

    if (!(action in this._actions)) {
      throw new Error(action + " is not a registered action");
    }

    if (!argument) {
      throw new Error("actionRequest must have an 'argument' property");
    }

    if (!value) {
      throw new Error("actionRequest must have an 'value' property");
    }

    this._actionEnabled(action, true);
    if (this._actions[action].instance.process) {
      this._actions[action].instance.process(request);
    }
  };
}
