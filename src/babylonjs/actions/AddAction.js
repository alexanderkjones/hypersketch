import { Vector3, Matrix, PointerEventTypes } from "@babylonjs/core";

export default class AddAction {
  constructor(scene) {
    this._scene = scene;
    this._attachedMesh = null;
    this._observer = null;
  }

  attachScene(scene) {
    this._scene = scene;
    this._loader.attachScene(scene);
  }

  attachMesh(mesh) {
    this._attachedMesh = mesh;
    this._observer = _addMeshPointerObserver(this._scene);
  }

  _adttachMeshToPointerObserver(scene) {
    const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type == PointerEventTypes.POINTERMOVE) {
        const screenPosition = new Vector3(scene.pointerX, scene.pointerY, 0.99);
        const engine = scene.getEngine();
        const vector = Vector3.Unproject(screenPosition, engine.getRenderWidth(), engine.getRenderHeight(), Matrix.Identity(), scene.getViewMatrix(), scene.getProjectionMatrix());
        this._attachedMesh.position = vector;
      }
      if (pointerInfo.type == PointerEventTypes.POINTERDOWN) {
        this.dispose();
      }
    });

    return pointerObserver;
  }

  dispose() {
    if (this._observer) {
      this._scene.onPointerObservable.remove(this._observer);
    }
    this._attachedMesh = null;
  }
}
