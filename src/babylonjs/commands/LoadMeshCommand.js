export default class LoadMeshCommand {
  constructor(meshID, loader) {
    this.mesh = null;
    this.meshID = meshID;
    this.loader = loader;
  }

  execute() {
    this._store.set("meshToLoad", this.meshID);
    
    this.mesh = this._store.get("attachedScene").meshes
    this.mesh = this.loader.loadMesh(this.meshID);
  }

  undo() {
    this.loader.unloadMesh(this.mesh);
  }
}
