import { Vector3, Matrix, PointerEventTypes } from "@babylonjs/core";
import LoadMeshCommand from "babylonjs/commands/LoadMeshCommand";

export default class AddAction {
  constructor() {
    this._store = null;
    this._scene = null;
    this._attachedMesh = null;
    this._observer = null;
  }

  attachStore(store) {
    this._store = store;
    this._store.watch("attachedScene", this, this.onSetAttachedScene);
  }

  onSetAttachedScene = (scene) => {
    this._scene = scene;
  };

  process(request) {
    const { action, argument, value } = request;
    switch (argument) {
      case "loadMesh":
        this._store.set("executeCommand", new LoadMeshCommand(value));
        break;
    }
  }

  // _adttachMeshToPointerObserver(scene) {
  //   const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
  //     if (pointerInfo.type == PointerEventTypes.POINTERMOVE) {
  //       const screenPosition = new Vector3(scene.pointerX, scene.pointerY, 0.99);
  //       const engine = scene.getEngine();
  //       const vector = Vector3.Unproject(screenPosition, engine.getRenderWidth(), engine.getRenderHeight(), Matrix.Identity(), scene.getViewMatrix(), scene.getProjectionMatrix());
  //       this._attachedMesh.position = vector;
  //     }
  //     if (pointerInfo.type == PointerEventTypes.POINTERDOWN) {
  //       this.dispose();
  //     }
  //   });

  //   return pointerObserver;
  // }

  dispose() {
    if (this._observer) {
      this._scene.onPointerObservable.remove(this._observer);
    }
    this._attachedMesh = null;
  }
}
