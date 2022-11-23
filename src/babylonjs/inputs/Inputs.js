import PointerObserver from "./PointerObserver";
import KeyboardObserver from "./KeyboardObserver";

export default class Inputs {
  constructor(actions) {
    this._actions = actions;
    this.pointerObserver = new PointerObserver(actions);
    this.keyboardObserver = new KeyboardObserver(actions);
  }

  attachScene(scene) {
    this.pointerObserver.attachScene(scene);
    this.keyboardObserver.attachScene(scene);
  }
}
