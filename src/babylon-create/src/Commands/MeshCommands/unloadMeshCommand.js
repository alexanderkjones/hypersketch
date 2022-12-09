import { meshLoader } from "../../Loaders";

export class UnloadMeshCommand {
  constructor(mesh, executed = false) {
    this.mesh = mesh;
    this.restore = {
      name: mesh.name,
      metadata: { ...mesh.metadata },
      position: mesh.position.clone(),
      rotation: mesh.rotation.clone(),
      scaling: mesh.scaling.clone(),
    };
    this.executed = executed;
  }

  execute() {
    if (this.executed) return;
    meshLoader.unload(this.mesh);
    this.executed = true;
  }

  undo() {
    this.mesh = meshLoader.load(this.restore.name);
    this.mesh.metadata = { ...this.restore.metadata };
    this.mesh.position = this.restore.position.clone();
    this.mesh.rotation = this.restore.rotation.clone();
    this.mesh.scaling = this.restore.scaling.clone();
    this.executed = false;
  }
}
