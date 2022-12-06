import { Vector3, Matrix, PointerEventTypes } from "@babylonjs/core";
import { LoadMeshCommand } from "../../Commands/MeshCommands";
import { store, stack } from "../../Globals";

export class AddMeshAction {
  constructor() {
    this._scene = null;
    this._observer = null;
    this._attachedMesh = null;
    this._initialMeshState = null;
    this._finalMeshState = null;
    this._watchStore();
  }

  _watchStore() {
    store.watch("attachedScene", this, (scene) => {
      this._scene = scene;
    });
  }

  process(request) {
    console.log(request);
    const { action, argument, value, options } = request;
    switch (argument) {
      case "loadMesh":
        this._attachedMesh = this._stack.execute(new LoadMeshCommand(value, this._scene));
        if (options && options.attachMeshToPointer) {
          this._initialMeshState = {
            position: this._attachedMesh.position,
            rotation: this._attachedMesh.rotation,
            scale: this._attachedMesh.scale,
          };
          this._attachMeshToPointer(this._attachedMesh);
        }
        break;
      case "cancel":
        break;
    }
  }

  _placeMesh() {
    this._finalMeshState = {
      position: this._attachedMesh.position,
      rotation: this._attachedMesh.rotation,
      scale: this._attachedMesh.scale,
    };
    //stack.extend(new TransformMeshCommand(this._attachedMesh, this._initialMeshState, this._finalMeshState));
    this.dispose();
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
  //        this._placeMesh();
  //       this.dispose();
  //     }
  //   });

  //   return pointerObserver;
  // }

  dispose() {
    this._attachedMesh = null;
    this._initialMeshState = null;
    this._finalMeshState = null;
    if (this._observer) {
      this._scene.onPointerObservable.remove(this._observer);
    }
  }
}
