import { store } from "../Globals";
import { Profiler } from "../Profiler";
import { ActionManager } from "../Actions";
import { DefaultArcRotateCamera } from "../Cameras";
import { DefaultGrid } from "../Grids";
import { DefaultEnvironment } from "../Environments";
import { ArcRotateCamera, Vector3 } from "@babylonjs/core";

export class EditorApplication {
  constructor() {
    this.scene = null;
    this.profiler = new Profiler();
    this.actionManager = new ActionManager();
  }

  attachScene(scene) {
    this.scene = scene;
    this.profiler.attachScene(scene);
    this.grid = new DefaultGrid(scene);
    this.camera = new DefaultArcRotateCamera(scene);
    this.environment = new DefaultEnvironment(scene);
    store.set("attachedScene", scene);
  }

  set(request) {
    if (request.action) {
      store.set("actionRequest", request);
    }
  }
}
