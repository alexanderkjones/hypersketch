/* 
Performance api taken from inspector profiler tab:
https://github.com/BabylonJS/Babylon.js/blob/de060f6617c52ac66d670cc17764bb075dc31977/packages/dev/inspector/src/components/actionTabs/tabs/statisticsTabComponent.tsx
 */
export class Profiler {
  constructor() {
    this.scene = null;
    this.engine = null;
    this.updateable = false;
    this.offsets = {};
    this.state = {};
    this.reset();
  }

  reset() {
    this.state = {
      fps: 0,
      indices: 0,
      faces: 0,
      meshes: 0,
    };
    this.offsets = {
      fps: 0,
      indices: 0,
      faces: 0,
      meshes: 0,
    };
  }

  attachScene(scene, offsets = { fps: 0, indices: 48, faces: 16, meshes: 3 }) {
    this.reset();
    this.scene = scene;
    this.engine = scene.getEngine();
    this.updateable = true;
    if (offsets) {
      this.offsets = offsets;
    }
  }

  update() {
    if (!this.updateable) {
      return;
    }
    this.state.fps = this.engine.getFps().toFixed();
    this.state.indices = (this.scene.getActiveIndices() - this.offsets.indices).toString();
    this.state.faces = (this.scene.getActiveIndices() / 3 - this.offsets.faces).toString();
    this.state.meshes = (this.scene.getActiveMeshes().length - this.offsets.meshes).toString();
  }

  get() {
    this.update();
    return this.state;
  }

  dispose() {
    this.scene = null;
    this.engine = null;
    this.updateable = false;
    this.reset();
  }
}
