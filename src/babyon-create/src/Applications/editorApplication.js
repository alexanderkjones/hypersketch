import { store } from "../Globals";
import { Profiler } from "../Profiler";
import { ActionManager } from "../Actions";
import { DefaultArcRotateCamera } from "../Cameras";
import { DefaultGrid } from "../Grids";
import { DefaultEnvironment } from "../Environments";

export class EditorApplication {
  constructor() {
    this.scene = null;
    this.profiler = new Profiler();
    this.actionManager = new ActionManager();
  }

  attachScene(scene) {
    this.scene = scene;
    store.set("attachedScene", scene);
    this.grid = new DefaultGrid(scene);
    this.camera = new DefaultArcRotateCamera(scene);
    this.environment = new DefaultEnvironment(scene);
  }

  set(request) {
    if (action in request) {
      store.set("actionRequest", request);
    }
  }
}
