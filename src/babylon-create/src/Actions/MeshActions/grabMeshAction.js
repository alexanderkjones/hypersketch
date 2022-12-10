import { PointerDragBehavior } from "@babylonjs/core";

export class GrabMeshAction {
  constructor() {
    this._scene = null;
    this._attachedMesh = null;
    this._grabBehavior = new PointerDragBehavior();
    this._watchStore();
  }

  _watchStore() {
    store.watch("attachedScene", (scene) => {
      this._scene = scene;
    });
    store.watch("attachedMesh", this._onSetAttachedMesh);
  }

  _onSetAttachedMesh = (mesh) => {
    if (this._attachedMesh) {
      this._attachedMesh.removeBehavior(this._grabBehavior);
    }

    this._attachedMesh = mesh;

    if (this._attachedMesh) {
      this._attachedMesh.addBehavior(this._grabBehavior);
    }
  };

  dispose() {
    if (this._attachedMesh) {
      this._attachedMesh.removeBehavior(this._grabBehavior);
    }
    this._attachedMesh = null;
    store.unwatch(this);
  }
}
