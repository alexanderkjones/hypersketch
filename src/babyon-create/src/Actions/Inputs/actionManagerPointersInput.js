import { PointerEventTypes, AbstractMesh } from "@babylonjs/core";
import { store } from "../../Globals";

export class AttachedMeshPointerObserver {
  constructor() {
    this._scene = null;
    this._lockAttachedMesh = null;
    this._observer = null;
    this._watchStore();
  }

  _watchStore() {
    store.watch("attachedScene", this, this._onSetAttachedScene);
    store.watch("lockAttachedMesh", this, (value) => {
      this._lockAttachedMesh = value;
    });
  }

  _onSetAttachedScene = (scene) => {
    if (this._observer) {
      this._scene.onKeyboardObservable.remove(this._observer);
    }
    this._scene = scene;
    this._observer = this._attachToMeshPointerObserver(scene);
  };

  _attachToMeshPointerObserver = (scene) => {
    if (!scene) return;
    const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type == PointerEventTypes.POINTERDOWN) {
        if (this._lockAttachedMesh) {
          return;
        }
        if (!(pointerInfo.pickInfo && pointerInfo.pickInfo.pickedMesh)) {
          this._store.set("attachedMesh", null);
          return;
        }
        if (this._ignoredMeshes.includes(pointerInfo.pickInfo.pickedMesh)) {
          this._store.set("attachedMesh", null);
          return;
        }
        if (!(pointerInfo.pickInfo.pickedMesh instanceof AbstractMesh)) {
          this._store.set("attachedMesh", null);
          return;
        }
        if (pointerInfo.pickInfo.pickedMesh == this._attachedMesh) {
          return;
        }
        this._store.set("attachedMesh", pointerInfo.pickInfo.pickedMesh);
      }
    });

    return pointerObserver;
  };
}
