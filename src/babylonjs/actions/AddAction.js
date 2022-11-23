import { Vector3, Matrix, PointerEventTypes } from "@babylonjs/core";
import LoadMeshCommand from "babylonjs/commands/LoadMeshCommand";

export default class AddAction {
  constructor() {
    this._scene = null;
    this._commandStack = null;
    this._attachedMesh = null;
    this._observer = null;
  }

  attachScene(scene) {
    this._scene = scene;
    this._loader.attachScene(scene);
  }

  attachMesh(mesh) {
    this._attachedMesh = mesh;
    //this._observer = this._addMeshPointerObserver(this._scene);
  }

  attachCommandStack(stack) {
    this._commandStack = stack;
  }

  process(request) {
    switch (request.argument) {
      case "loadMesh":
        this._commandStack.execute(new LoadMeshCommand(request.value, this._loader))
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
