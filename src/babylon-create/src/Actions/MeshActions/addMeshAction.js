import { Vector3, Matrix, PointerEventTypes } from "@babylonjs/core";
import { LoadMeshCommand } from "../../Commands/MeshCommands";
import { store, stack } from "../../Globals";

export class AddMeshAction {
  constructor() {
    this._scene = null;
    this._observer = null;
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
    const { action, argument, value, options } = request;
    switch (argument) {
      case "enabled":
        store.set("attachedMesh", stack.execute(new LoadMeshCommand(value)));
        store.set("actionRequest", { action: "moveMesh", argument: "enabled", value: true });
        break;
    }
  }

  dispose() {
    this._attachedMesh = null;
    this._initialMeshState = null;
    this._finalMeshState = null;
    if (this._observer) {
      this._scene.onPointerObservable.remove(this._observer);
    }
    store.unwatch(this);
  }
}
