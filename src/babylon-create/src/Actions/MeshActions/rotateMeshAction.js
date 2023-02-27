import { TransformMeshCommand } from "../../Commands/MeshCommands";
import { TransformHelper } from "../../Helpers/";
import { store, stack } from "../../Globals";
import { Vector3 } from "@babylonjs/core";
import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer";
import { RotationGizmo } from "@babylonjs/core/Gizmos";

export class RotateMeshAction {
  constructor() {
    this._attachedMesh = null;
    this._transform = new TransformHelper();
    this._gizmo = null;
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
        this._transfrom.setStateEnd({ rotation: value });
        this._commit();
        break;
    }
  }

  _onSetAttachedMesh = (mesh) => {
    this._attachedMesh = mesh;

    if (this._gizmo) this._gizmo.dispose();

    if (this._attachedMesh) {
      console.log("rotate attached mesh", this._attachedMesh);
      this._gizmo = new RotationGizmo();
      this._gizmo.updateGizmoRotationToMatchAttachedMesh = true;
      this._gizmo.updateGizmoPositionToMatchAttachedMesh = true;
      this._gizmo.attachedMesh = this._attachedMesh;

      console.log("gizmo: ", this._gizmo);
      this._gizmo.attachedMesh = this._attachedMesh;

      this._gizmo.onDragStartObservable.add(() => {
        this._transform.setStateInit();
      });

      this._gizmo.onDragEndObservable.add(() => {
        this._transform.setStateEnd();
        this._commit(true);
      });
    }
  };

  _commit(executed) {
    stack.execute(new TransformMeshCommand(this._attachedMesh, this._transform.getStateInit(), this._transform.getStateEnd(), executed));
  }

  dispose() {
    if (this._gizmo) {
      this._gizmo.dispose();
      this._gizmo = null;
    }
    this._attachedMesh = null;
    this._transform.dispose();
    store.unwatch(this);
  }
}
