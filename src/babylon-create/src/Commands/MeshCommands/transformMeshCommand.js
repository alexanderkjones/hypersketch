export class TransformMeshCommand {
  constructor(mesh, start, end, executed = false) {
    this.mesh = mesh;
    this.stateStart = start;
    this.stateEnd = end;
    this.executed = executed;
  }

  execute() {
    if (this.executed) return;
    console.log(this.stateEnd)
    this.mesh.position = this.stateEnd.position;
    this.mesh.rotation = this.stateEnd.rotation;
    this.mesh.scaling = this.stateEnd.scaling;
    this.executed = true;
  }

  undo() {
    this.mesh.scaling = this.stateStart.scaling;
    this.mesh.rotation = this.stateStart.rotation;
    this.mesh.position = this.stateStart.position;
    this.executed = false;
  }
}
