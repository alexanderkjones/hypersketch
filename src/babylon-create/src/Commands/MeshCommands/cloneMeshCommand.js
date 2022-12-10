import { LoadMeshCommand } from "./loadMeshCommand";
import { TransformMeshCommand } from "./transformMeshCommand";

export class CloneMeshCommand {
  constructor(parentMesh, executed = false) {
    this.mesh = null;
    this.parentMesh = parentMesh;
    this.loadMeshCommand = null;
    this.transfromMeshCommand = null;
    this.executed = executed;
  }

  execute() {
    if (!this.executed) {
      // Load mesh
      this.loadMeshCommand = new LoadMeshCommand(this.parentMesh.name);
      this.mesh = this.loadMeshCommand.execute();

      // Initialise start transforms
      const stateStart = {
        position: this.mesh.position.clone(),
        rotation: this.mesh.rotation.clone(),
        scaling: this.mesh.scaling.clone(),
      };

      // Initialise start transforms
      const stateEnd = {
        position: this.parentMesh.position.clone(),
        rotation: this.parentMesh.rotation.clone(),
        scaling: this.parentMesh.scaling.clone(),
      };

      // Transform
      this.transformMeshCommand = new TransformMeshCommand(this.mesh, stateStart, stateEnd);
      this.transformMeshCommand.execute();
      this.executed = true;
    }
    return this.mesh;
  }

  undo() {
    this.transformMeshCommand.undo();
    this.loadMeshCommand.undo();
    this.executed = false;
  }
}
