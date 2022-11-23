import { PointerEventTypes, AbstractMesh } from "@babylonjs/core";

export default class EditorPointerObserver {
  constructor(actions) {
    this._actions = actions;
    this._observer = null;
  }

  attachScene(scene) {
    if (this._observer) this._scene.onKeyboardObservable.remove(this._observer);
    this._scene = scene;
    this._observer = this._attachToMeshPointerObserver(scene);
  }

  _attachToMeshPointerObserver = (scene) => {
    const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type == PointerEventTypes.POINTERDOWN) {
        if (!(pointerInfo.pickInfo && pointerInfo.pickInfo.pickedMesh)) {
          this._actions.attachMesh(null);
          return;
        }
        if (this._ignoredMeshes.includes(pointerInfo.pickInfo.pickedMesh)) {
          this._actions.attachMesh(null);
          return;
        }
        if (!(pointerInfo.pickInfo.pickedMesh instanceof AbstractMesh)) {
          this._actions.attachMesh(null);
          return;
        }
        if (pointerInfo.pickInfo.pickedMesh == this._attachedMesh) {
          return;
        }
        this._actions.attachMesh(pointerInfo.pickInfo.pickedMesh);
      }
    });

    return pointerObserver;
  };
}
