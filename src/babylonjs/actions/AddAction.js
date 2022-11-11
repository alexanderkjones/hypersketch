import { PointerEventTypes } from '@babylonjs/core';

export class AddAction {
  constructor(scene) {
    this._scene = scene;
    this._loader = new MeshManager();
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

  loadMesh(url) {}

  _addMeshLoader(url, scene) {
    SceneLoader.ImportMesh('', url, null, scene, function (meshes) {
      // do something with the scene
    });
  }

  _addMeshPointerObserver(scene) {
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
  }

  dispose() {
    this._attachedMesh = null;
  }
}
