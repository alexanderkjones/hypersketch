import Loaders from "babylonjs/loaders/Loaders";
// import {EditorActions} from './actions/EditorActions';
// import {EditorInputs} from './inputs/EditorInputs';
import { arcCamera } from "babylonjs/cameras/ArcCamera";
import { standardGrid } from "babylonjs/grids/StandardGrid";
import { standardEnvironment } from "babylonjs/environments/StandardEnvironment";
import Profiler from "babylonjs/profiler/Profiler";

export default class Editor {
  constructor() {
    this.scene = null;
    this.profiler = new Profiler();
    this.loaders = new Loaders();
    // this.actions = new EditorActions(this.loaders);
    // this.input = new EditorInputs(this.actions);
  }

  attachScene(scene) {
    this.scene = scene;
    this.camera = arcCamera(scene);
    this.grid = standardGrid(scene);
    this.environment = standardEnvironment(scene);
    this.profiler.attachScene(scene, { indices: -48, faces: 16, meshes: 4 });
    this.loaders.attachScene(scene);
    this.loaders.loadMesh("cube-aluminum-6061");
    // this.actions.attachScene(scene);
    // this.inputs.attachScene(scene);
  }

  setAction(action) {
    this.actions.process(action);
  }
}
