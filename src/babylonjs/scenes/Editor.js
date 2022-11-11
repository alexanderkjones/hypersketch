export class Editor {
  constructor() {
    this.scene = null;
    this.actions = new EditorActions();
    this.input = new EditorInputs(this.actions);
  }

  attachScene(scene) {
    this.scene = scene;
    this.actions.attachScene(scene);
    this.inputs.attachScene(scene);
  }
}
