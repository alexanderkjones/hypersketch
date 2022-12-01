import CommandStack from "babylonjs/commands/CommandStack";

import AddAction from "babylonjs/actions/AddAction";
// import GrabAction from "babylonjs/actions/GrabAction";
// import MoveAction from "babylonjs/actions/MoveAction";
// import ScaleAction from "babylonjs/actions/ScaleAction";
// import RotateAction from "babylonjs/actions/RotateAction";
// import JointAction from "babylonjs/actions/JointAction";

export default class Actions {
  constructor() {
    this._store = null;
    this._scene = null;
    this._actionEnabled = null;
    this._attachedMesh = null;
    this.actions = {};

    this.registerAction("add", AddAction);
    // this.registerAction("grab", GrabAction);
    // this.registerAction("move", MoveAction);
    // this.registerAction("scale", ScaleAction);
    // this.registerAction("rotate", RotateAction);
    // this.registerAction("joint", JointAction);
  }

  attachStore(store){
    this._store = store;
    this._store.watch("attachedScene", this, this.onSetAttachedScene);
    this._store.watch("attachedMesh", this, this.onSetAttachedMesh);
    this._store.watch("actionEnabled", this, this.onSetActionEnabled);
  }

  onSetAttachedScene(scene) {
    this._scene = scene;
    for (let key in this.actions) {
      let action = this.actions[key];
      if (action) {
        action.attachScene(scene);
      }
    }
  }

  onSetAttachedMesh = (mesh) => {
    this._attachedMesh = mesh;
    for (let key in this.actions) {
      let action = this.actions[key];
      if (action && this.actionsEnabled[key]) {
        action.attachMesh(mesh);
      }
    }
  }

  registerAction(key, class) {
    const action = {};
    action.class = class;
    action.instance = null;
    action.enabled = false;
    this.actions[key] = action;
  }

  // registerAction(key, actionClass) {
  //   this.actions[key] = null;
  //   this.actionsEnabled[key] = false;
  //   this.actionsClasses[key] = actionClass;
  // }

  actionsDisableAll() {
    for (let key in this.actions) {
      let action = this.actions[key];
      if (action && this.actionsEnabled[key]) {
        action.dispose();
        this.actionsEnabled[key] = false;
      }
    }
  }

  onSetActionEnabled = (props) => {
    const {key, enabled} = props;
    const action = this.actions[key];
    if (enabled) {
      if(!(action === this._actionEnabled)){
        delete this._actionEnabled.instance;
        this._actionEnabled = action;
      }
      if (!action.instance) {
        action.instance = new action.class()
        action.instance.setStore(this._store);
      }
    } else {
      delete this._actionEnabled.instance;
    }
    action.enabled = enabled;
  }

  // onSetActionEnabled = (props) => {
  //   const {action, enabled} = props;
  //   if (enabled) {
  //     this.actionsDisableAll();
  //     if (!this.actions[key]) {
  //       let actionClass = this.actionsClasses[key];
  //       this.actions[key] = new actionClass();
  //       this.actions[key]._attachCommandStack(this._commandStack);
  //     }
  //     if (this._attachedScene) {
  //       this.actions[key]._attachScene(this._attachedScene);
  //     }
  //     if (this._attachedMesh) {
  //       this.actions[key]._attachMesh(this._attachedMesh);
  //     }
  //   } else {
  //     if (this.actions[key]) {
  //       this.actions[key].dispose();
  //     }
  //   }
  //   this.actionsEnabled[key] = value;
  // }

  onSetActionRequest = (request) => {
    const {action} = request;
    if (!action) {
      throw new Error("actionRequest must contain a target action key");
    }
    if (!(action in this.actions)) {
      throw new Error(action + " is not a registered action");
    }
    if (!this.actions[action].enabled) {
      throw new Error(action + " is not enabled, you must first enable this action using actionEnabled(actionName, bool)");
    }
    if (!request.argument) {
      throw new Error("actionRequest must have an 'argument' property");
    }
    if (!request.value) {
      throw new Error("actionRequest must have an 'value' property");
    }

    this.actions[action].process(request);
  }
}
