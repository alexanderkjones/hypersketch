export class Editor {
  constructor() {
    this.scene = null;
    this.loaders = new EditorLoaders();
    this.actions = new EditorActions(this.loaders);
    this.input = new EditorInputs(this.actions);
  }

  attachScene(scene) {
    this.scene = scene;
    this.loaders.attachScene(scene);
    this.actions.attachScene(scene);
    this.inputs.attachScene(scene);
  }
}
