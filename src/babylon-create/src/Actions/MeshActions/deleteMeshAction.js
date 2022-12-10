import { Vector3, Matrix, PointerEventTypes } from "@babylonjs/core";
import { UnloadMeshCommand } from "../../Commands/MeshCommands";
import { store, stack } from "../../Globals";

export class DeleteMeshAction {
  constructor() {
    this._scene = null;
    this._attachedMesh = null;
    this._watchStore();
  }

  _watchStore() {
    store.watch("attachedScene", this, (scene) => {
      this._scene = scene;
    });
    store.watch("attachedMesh", this, (mesh) => {
      this._attachedMesh = mesh;
    });
  }

  process(request) {
    const { action, argument, value, options } = request;
    if (this._attachedMesh) {
      stack.execute(new UnloadMeshCommand(this._attachedMesh));
      store.set("attachedMesh", null);
    }
  }

  dispose() {
    this._scene = null;
    this._attachedMesh = null;
    store.unwatch(this);
  }
}
