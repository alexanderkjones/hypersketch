import { meshLoader } from "../../Loaders";

export class UnloadMeshCommand {
  constructor(mesh, executed = false) {
    this.mesh = mesh;
    this.restore = {
      name: mesh.name,
      metadata: { ...mesh.metadata },
      position: mesh.position.clone(),
      rotation: mesh.rotation.clone(),
      scale: mesh.scale.clone(),
    };
    this.executed = executed;
  }

  execute() {
    if (this.executed) {
      return;
    }
    this._store.set("meshToUnload", this.mesh);
    this.executed = true;
  }

  undo() {
    this._store.set("meshToLoad", this.restore.name);
    this.mesh = this._store.get("loadedMesh");
    this.mesh.position = this.restore.position;
    this.mesh.rotation = this.restore.rotation;
    this.mesh.scale = this.restore.scale;
    this.executed = false;
  }
}
