import Profiler from "babylonjs/profiler/Profiler";
import Loaders from "babylonjs/loaders/Loaders";
import Actions from "babylonjs/actions/Actions";
import Inputs from "babylonjs/inputs/Inputs";

// import {EditorActions} from './actions/EditorActions';
// import {EditorInputs} from './inputs/EditorInputs';
import { arcCamera } from "babylonjs/cameras/ArcCamera";
import { standardGrid } from "babylonjs/grids/StandardGrid";
import { standardEnvironment } from "babylonjs/environments/StandardEnvironment";

export default class Editor {
  constructor() {
    this.scene = null;
    this.store = new Store();
    this.profiler = new Profiler();
    this.loaders = new Loaders();
    this.actions = new Actions();
    this.inputs = new Inputs();
  }

  attachStore(store) {
    this.inputs.attachStore(store);
    this.loaders.attachStore(store);
  }

  attachScene(scene) {
    this.scene = scene;
    this.camera = arcCamera(scene);
    this.grid = standardGrid(scene);
    this.environment = standardEnvironment(scene);
    this.profiler.attachScene(scene, { indices: -48, faces: 16, meshes: 4 });
    this.loaders.attachScene(scene);
    //this.loaders.loadMesh("cube-aluminum-6061");
    this.actions.attachScene(scene);
    // this.inputs.attachScene(scene);
  }

  actionRequest(request) {
    this.actions.actionRequest(request);
  }
}
