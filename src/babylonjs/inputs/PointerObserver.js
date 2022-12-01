import { PointerEventTypes, AbstractMesh } from "@babylonjs/core";

export default class EditorPointerObserver {
  constructor() {
    this._store = null;
    this._scene = null;
    this._observer = null;
  }

  attachStore(store) {
    this._store = store;
    this._store.watch("attachedScene", this, this.onSetAttachedScene);
  }

  onSetAttachedScene = (scene) => {
    if (this._observer) {
      this._scene.onKeyboardObservable.remove(this._observer);
    }
    this._scene = scene;
    this._observer = this._attachToMeshPointerObserver(scene);
  };

  _attachToMeshPointerObserver = (scene) => {
    const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type == PointerEventTypes.POINTERDOWN) {
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
