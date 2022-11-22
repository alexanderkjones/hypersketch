import MaterialLoader from "babylonjs/loaders/MaterialLoader";
import MeshLoader from "babylonjs/loaders/MeshLoader";

export default class Loaders {
  constructor() {
    this._scene = null;
    this._materialLoader = new MaterialLoader();
    this._meshLoader = new MeshLoader(this._materialLoader);
  }

  attachScene(scene) {
    this._scene = scene;
    this._materialLoader.attachScene(scene);
    this._meshLoader.attachScene(scene);
  }

  loadMesh(toLoad) {
    return this._meshLoader.load(toLoad);
  }
}
