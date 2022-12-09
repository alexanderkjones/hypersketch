import { meshLoader } from "../../Loaders";
export class LoadMeshCommand {
  constructor(meshRegistryId, executed = false) {
    this.mesh = null;
    this.meshRegistryId = meshRegistryId;
    this.executed = executed;
  }

  execute() {
    if (!this.executed) {
      this.mesh = meshLoader.load(this.meshRegistryId);
      this.executed = true;
    }
    return this.mesh;
  }

  undo() {
    this.mesh = meshLoader.unload(this.mesh);
    this.executed = false;
  }
}
