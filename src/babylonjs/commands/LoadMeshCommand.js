export default class LoadMeshCommand {
  constructor(meshID, loader) {
    this.mesh = null;
    this.meshID = meshID;
    this.loader = loader;
  }

  execute() {
    this.mesh = this.loader.loadMesh(this.meshID);
  }

  undo() {
    this.loader.unloadMesh(this.mesh);
  }
}
