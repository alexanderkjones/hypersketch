import MaterialLoader from "babylonjs/loaders/MaterialLoader";
import MeshLoader from "babylonjs/loaders/MeshLoader";

export default class Loaders {
  constructor() {
    this.register("materialLoader", new MaterialLoader());
    this.register("meshLoader", new MeshLoader());
  }

  attachStore(store) {
    for (const loader in this) {
      if (typeof this[loader].attachStore === "function") {
        this[loader].attachStore(store);
      }
    }
  }

  register(name, object) {
    this[name] = object;
  }

  unregister(name) {
    delete this[name];
  }
}
