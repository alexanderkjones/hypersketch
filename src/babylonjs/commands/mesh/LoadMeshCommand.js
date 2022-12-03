import { meshLoader } from "babylonjs/loaders";
export default class LoadMeshCommand {
  constructor(meshRegistryId, executed = false) {
    this.mesh = null;
    this.meshRegistryId = meshId;
    this.executed = executed;
  }

  execute() {
    if (!this.executed) {
      this.mesh = meshLoader.load(meshRegistryId);
      this.executed = true;
    }
  }

  undo() {
    this.mesh = meshLoader.unload(this.mesh);
    this.executed = false;
  }
}
