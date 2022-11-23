export default class AddMeshCommand {
  constructor(mesh, loader) {
    this.mesh = mesh;
    this.meshID = mesh.name;
    this.meshMetadata = mesh.metadata;
    this.loader = loader;
  }

  execute() {
    this.loader.unloadMesh(mesh);
  }

  undo() {
    this.mesh = this.loader.loadMesh(this.meshID);
    this.mesh.metadata = this.meshMetadata;
  }
}
