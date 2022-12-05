import Profiler from "babylonjs/profiler/Profiler";
import Actions from "babylonjs/actions/Actions";
import Inputs from "babylonjs/inputs/Inputs";

import { store } from "babylonjs/globals";
import { arcCamera } from "babylonjs/cameras/ArcCamera";
import { standardGrid } from "babylonjs/grids/StandardGrid";
import { standardEnvironment } from "babylonjs/environments/StandardEnvironment";

export default class Editor {
  constructor() {
    this._scene = null;
    this.profiler = new Profiler();
    this.inputs = new Inputs();
    this.actions = new Actions();
  }

  attachScene(scene) {
    store.set("attachedScene", scene);
    this.camera = arcCamera(scene);
    this.grid = standardGrid(scene);
    this.environment = standardEnvironment(scene);
  }

  set(request) {
    if (action in request) {
      store.set("actionRequest", request);
    }
  }
}
