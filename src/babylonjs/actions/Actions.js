import CommandStack from "babylonjs/commands/CommandStack";

import AddAction from "babylonjs/actions/AddAction";
// import GrabAction from "babylonjs/actions/GrabAction";
// import MoveAction from "babylonjs/actions/MoveAction";
// import ScaleAction from "babylonjs/actions/ScaleAction";
// import RotateAction from "babylonjs/actions/RotateAction";
// import JointAction from "babylonjs/actions/JointAction";

export default class Actions {
  constructor(loader) {
    this._scene = null;
    this._loader = loader;
    this._attachedMesh = null;
    this.actions = {};
    this.actionsEnabled = {};
    this.actionsClasses = {};
    this.commandStack = new CommandStack();

    this.registerAction("add", AddAction);
    // this.registerAction("grab", GrabAction);
    // this.registerAction("move", MoveAction);
    // this.registerAction("scale", ScaleAction);
    // this.registerAction("rotate", RotateAction);
    // this.registerAction("joint", JointAction);
  }

  attachScene(scene) {
    this._scene = scene;
    for (let key in this.actions) {
      let action = this.actions[key];
      if (action) {
        action.attachScene(scene);
      }
    }
  }

  attachMesh(mesh) {
    this._attachedMesh = mesh;
    for (let key in this.actions) {
      let action = this.actions[key];
      if (action && this.actionsEnabled[key]) {
        action.attachMesh(mesh);
      }
    }
  }

  registerAction(key, actionClass) {
    this.actions[key] = null;
    this.actionsEnabled[key] = false;
    this.actionsClasses[key] = actionClass;
  }

  actionsDisableAll() {
    for (let key in this.actions) {
      let action = this.actions[key];
      if (action && this.actionsEnabled[key]) {
        action.dispose();
        this.actionsEnabled[key] = false;
      }
    }
  }

  actionEnabled(key, value) {
    if (value) {
      this.actionsDisableAll();
      if (!this.actions[key]) {
        let actionClass = this.actionsClasses[key];
        this.actions[key] = new actionClass();
        this.actions[key]._attachCommandStack(this._commandStack);
      }
      if (this._attachedScene) {
        this.actions[key]._attachScene(this._attachedScene);
      }
      if (this._attachedMesh) {
        this.actions[key]._attachMesh(this._attachedMesh);
      }
    } else {
      if (this.actions[key]) {
        this.actions[key].dispose();
      }
    }
    this.actionsEnabled[key] = value;
  }

  actionRequest(request) {
    if (!request.action) {
      throw new Error("actionRequest must contain a target action key");
    }
    if (!(request.action in this.actions)) {
      throw new Error(request.action + " is not a registered action");
    }
    if (!this.actionsEnabled[request.action]) {
      throw new Error(request.action + " is not enabled, you must first enable this action using actionEnabled(actionName, bool)");
    }
    if (!request.argument) {
      throw new Error("actionRequest must have an 'argument' property");
    }
    if (!request.value) {
      throw new Error("actionRequest must have an 'value' property");
    }

    this.actions[request.action].process(request);
  }
}
