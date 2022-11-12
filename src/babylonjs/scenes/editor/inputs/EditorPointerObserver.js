import { PointerEventTypes } from '@babylonjs/core';

export class EditorPointerObserver {
  constructor() {
    this._actions = actions;
    this._observer = null;
  }

  attachScene(scene) {
    // TODO: remove past observer if scene changes
    this._observer = _attachToMeshPointerObserver(scene);
  }

  _attachToMeshPointerObserver = (scene) => {
    const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
        if (pointerInfo.pickInfo && pointerInfo.pickInfo.pickedMesh) {
          let mesh = pointerInfo.pickInfo.pickedMesh;
          if (!this._ignoredMeshes.includes(mesh)) {
            if (mesh instanceof BABYLON.AbstractMesh) {
              if (this._attachedMesh != mesh) {
                this._actions.attachMesh(mesh);
              }
            } else {
              this._actions.attachMesh(null);
            }
          } else {
            this._actions.attachMesh(null);
          }
        } else {
          this._actions.attachMesh(null);
        }
      }
    });

    return pointerObserver;
  };
}
