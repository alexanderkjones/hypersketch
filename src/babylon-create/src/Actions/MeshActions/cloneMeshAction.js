import { Vector3, Matrix, PointerEventTypes } from "@babylonjs/core";
import { LoadMeshCommand } from "../../Commands/MeshCommands";
import { store, stack } from "../../Globals";

export class CloneMeshAction {
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
    if (!this._attachedMesh) return;
    const { action, argument, value, options } = request;
    switch (argument) {
      case "enabled":
        store.set("attachedMesh", stack.execute(new LoadMeshCommand(this._attachedMesh.name)));
        store.set("actionRequest", { action: "moveMesh", argument: "enabled", value: true });
        break;
    }
  }

  dispose() {
    this._attachedMesh = null;
  }
}
