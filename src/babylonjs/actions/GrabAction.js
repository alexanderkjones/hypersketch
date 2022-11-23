import { PointerDragBehavior } from "@babylonjs/core";

export default class GrabAction {
  constructor() {
    this._scene = null;
    this._attachedMesh = null;
    this._grabBehavior = new PointerDragBehavior();
  }

  attachScene(scene) {
    this._scene = scene;
  }

  attachMesh(mesh) {
    if (this._attachedMesh) {
      this._attachedMesh.removeBehavior(this._grabBehavior);
    }

    this._attachedMesh = mesh;

    if (this._attachedMesh) {
      this._attachedMesh.addBehavior(this._grabBehavior);
    }
  }

  dispose() {
    if (this._attachedMesh) {
      this._attachedMesh.removeBehavior(this._grabBehavior);
    }
    this._attachedMesh = null;
  }
}
