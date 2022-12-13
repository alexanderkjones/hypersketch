import { TransformMeshCommand } from "../../Commands/MeshCommands";
import { store, stack } from "../../Globals";
import { Vector3 } from "@babylonjs/core";
import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer";
import { RotationGizmo } from "@babylonjs/core/Gizmos";

export class RotateMeshAction {
  constructor() {
    this._attachedMesh = null;
    this._attachedMeshStart = null;
    this._attachedMeshEnd = null;
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
        const endState = this._getStateFromValue({ rotation: value });
        this._setStart();
        this._setEnd(endState);
        this._commit();
        break;
    }
  }

  _onSetAttachedMesh = (mesh) => {
    this._attachedMesh = mesh;
    if (this._gizmo) this._gizmo.dispose();

    if (this._attachedMesh) {
      this._gizmo = new RotationGizmo(UtilityLayerRenderer.DefaultUtilityLayer, 2);
      this._gizmo.updateGizmoRotationToMatchAttachedMesh = false;
      this._gizmo.updateGizmoPositionToMatchAttachedMesh = true;
      this._gizmo.attachedMesh = this._attachedMesh;

      this._gizmo.onDragStartObservable.add(() => {
        this._setStart();
      });

      this._gizmo.onDragEndObservable.add(() => {
        this._setEnd();
        this._commit(true);
      });
    }
  };

  _setStart(value) {
    value ? (this._attachedMeshStart = value) : (this._attachedMeshStart = this._getState());
  }

  _setEnd(value) {
    value ? (this._attachedMeshEnd = value) : (this._attachedMeshEnd = this._getState());
  }

  _commit(executed) {
    stack.execute(new TransformMeshCommand(this._attachedMesh, this._attachedMeshStart, this._attachedMeshEnd, executed));
  }

  _getStateFromValue(value) {
    const state = this._getState();
    for (const key in value) {
      if (state[key]) state[key] = new Vector3(...value[key]);
    }
    return state;
  }

  _getState() {
    if (!this._attachedMesh) return null;
    const state = {
      position: this._attachedMesh.position.clone(),
      rotation: this._attachedMesh.rotation.clone(),
      scaling: this._attachedMesh.scaling.clone(),
    };
    return state;
  }

  dispose() {
    if (this._gizmo) {
      this._gizmo.dispose();
      this._gizmo = null;
    }
    this._attachedMesh = null;
    this._setStart(null);
    this._setEnd(null);
    store.unwatch(this);
  }
}
