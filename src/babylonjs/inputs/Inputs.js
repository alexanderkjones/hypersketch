import PointerObserver from "./PointerObserver";
import KeyboardObserver from "./KeyboardObserver";

export default class Inputs {
  constructor() {
    this.register("pointerObserver", new PointerObserver());
    this.register("keyboardObserver", new KeyboardObserver());
  }

  attachStore(store) {
    for (const observer in this) {
      if (typeof this[observer].attachStore === "function") {
        this[observer].attachStore(store);
      }
    }
  }

  register(name, observer) {
    this[name] = observer;
  }

  unregister(name) {
    delete this[name];
  }
}
