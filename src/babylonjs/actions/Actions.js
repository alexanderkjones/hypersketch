import AddAction from "babylonjs/actions/AddAction";
// import GrabAction from "babylonjs/actions/GrabAction";
// import MoveAction from "babylonjs/actions/MoveAction";
// import ScaleAction from "babylonjs/actions/ScaleAction";
// import RotateAction from "babylonjs/actions/RotateAction";
// import JointAction from "babylonjs/actions/JointAction";

export default class Actions {
  constructor() {
    this._scene = null;
    this._enabled = null;
    this._actions = {};
    this._watchStore();

    this.registerAction("add", AddAction);
    // this.registerAction("grab", GrabAction);
    // this.registerAction("move", MoveAction);
    // this.registerAction("scale", ScaleAction);
    // this.registerAction("rotate", RotateAction);
    // this.registerAction("joint", JointAction);
  }

  _watchStore(){
    store.watch("attachedScene", this, (scene)=>{this._scene = scene});
    store.watch("actionRequest", this, this._onSetActionRequest);
  }

  registerAction(key, _class) {
    const action = {_class: class, instance: null, enabled: false};
    this.actions[key] = action;
  }

  _actionEnabled(key, enabled){
    const action = this.actions[key];
    if (enabled) {
      if(!(key == this._enabled)){
        this.actions[this._enabled].instance.dispose()
        delete this.actions[this._enabled].instance;
      }
      if (!action.instance) {
        action.instance = new action._class()
      }
      this._enabled = key;
    } else {
      delete this.actions[this._enabled].instance;
      this._enabled = null;
    }
    action.enabled = enabled;
  }

  onSetActionRequest = (request) => {
    const {action, argument, value} = request;
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
  }
}
