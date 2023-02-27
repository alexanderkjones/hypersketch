import { PointerDragBehavior } from "@babylonjs/core";
import { TransformMeshCommand } from "../../Commands/MeshCommands";
import { TransformHelper } from "../../Helpers/";
import { store, stack } from "../../Globals";

export class GrabMeshAction {
  constructor() {
    this._attachedMesh = null;
    this._transform = new TransformHelper();
    this._grabBehavior = new PointerDragBehavior();
    this._watchStore();
  }

  _watchStore() {
    store.watch("attachedMesh", this, this._onSetAttachedMesh);
  }

  process(request) {
    if (!this._attachedMesh) return;
    const { action, argument, value, options } = request;
    switch (argument) {
      case "enabled":
        return;
        break;
      case "set":
        if (!value) return;
        this._transform.setStateInit();
        this._transform.setStateEnd({ position: value });
        this._commit();
        break;
    }
  }

  _onSetAttachedMesh = (mesh) => {
    if (this._attachedMesh) {
      this._attachedMesh.removeBehavior(this._grabBehavior);
    }

    this._attachedMesh = mesh;

    if (this._attachedMesh) {
      this._attachedMesh.addBehavior(this._grabBehavior);

      this._grabBehavior.onDragStartObservable.add(() => {
        this._transform.setStateInit();
      });

      this._grabBehavior.onDragEndObservable.add(() => {
        this._transform.setStateEnd();
        this._commit(true);
      });
    }
  };

  _commit(executed) {
    stack.execute(new TransformMeshCommand(this._attachedMesh, this._transform.getStateInit(), this._transform.getStateEnd(), executed));
  }

  dispose() {
    if (this._attachedMesh) {
      this._attachedMesh.removeBehavior(this._grabBehavior);
    }
    this._attachedMesh = null;
    this._transform.dispose();
    store.unwatch(this);
  }
}
