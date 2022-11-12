import MaterialLoader from "../../materials/MaterialLoader";
import MeshLoader from "../../meshes/MeshLoader";

export class EditorLoaders {
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
    return this._meshLoader.loadMesh(toLoad);
  }
}
