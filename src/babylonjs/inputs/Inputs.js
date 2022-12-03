import PointerObserver from "./PointerObserver";
import KeyboardObserver from "./KeyboardObserver";

export default class Inputs {
  constructor(parent) {
    this.register("pointerObserver", new PointerObserver());
    this.register("keyboardObserver", new KeyboardObserver());
  }

  register(name, observer) {
    this[name] = observer;
  }

  unregister(name) {
    delete this[name];
  }
}
