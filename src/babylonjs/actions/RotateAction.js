export default class RotateAction {
  constructor() {
    this._scene = null;
    this._attachedMesh = null;
  }

  attachScene(scene) {
    this._scene = scene;
  }

  attachMesh(mesh) {
    this._attachedMesh = mesh;
  }
}
