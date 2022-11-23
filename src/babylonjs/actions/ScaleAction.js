import { ScaleGizmo } from "@babylonjs/core";

export class ScaleAction {
  constructor() {
    this._scene = null;
    this._attachedMesh = null;
    this._scaleGizmo = new ScaleGizmo();
  }

  attachScene(scene) {
    this._scene = scene;
  }

  attachMesh(mesh) {
    if (this._attachedMesh) {
      this._scaleGizmo.attachedMesh(null);
    }

    this._attachedMesh = mesh;

    if (this._attachedMesh) {
      this._scaleGizmo.attachedMesh(this._attachedMesh);
    }
  }

  axis(axis) {
    switch (axis) {
      case "x":
        this.scaleGizmo.xGizmo.isEnabled(true);
        this.scaleGizmo.yGizmo.isEnabled(false);
        this.scaleGizmo.zGizmo.isEnabled(false);
        break;
      case "y":
        this.scaleGizmo.xGizmo.isEnabled(false);
        this.scaleGizmo.yGizmo.isEnabled(true);
        this.scaleGizmo.zGizmo.isEnabled(false);
        break;
      case "z":
        this.scaleGizmo.xGizmo.isEnabled(false);
        this.scaleGizmo.yGizmo.isEnabled(false);
        this.scaleGizmo.zGizmo.isEnabled(true);
        break;
    }
  }

  dispose() {
    if (this._attachedMesh) {
      this._scaleGizmo.attachedMesh(null);
    }
    this._attachedMesh = null;
  }
}
