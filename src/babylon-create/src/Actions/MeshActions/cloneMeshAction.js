import { Vector3, Matrix, PointerEventTypes } from "@babylonjs/core";
import { CloneMeshCommand } from "../../Commands/MeshCommands";
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
    console.log("cloneMesh", this._attachedMesh);
    if (!this._attachedMesh) return;
    const { action, argument, value, options } = request;
    switch (argument) {
      case "enabled":
        store.set("attachedMesh", stack.execute(new CloneMeshCommand(this._attachedMesh)));
        store.set("actionRequest", { action: "moveMesh", argument: "enabled", value: true });
        break;
    }
  }

  dispose() {
    this._attachedMesh = null;
    store.unwatch(this);
  }
}
