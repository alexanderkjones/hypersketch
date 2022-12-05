import { ArcRotateCamera, Vector3 } from "@babylonjs/core";
import { store } from "../Globals";

export class DefaultArcRotateCamera extends ArcRotateCamera {
  constructor(scene, distance = 3) {
    super("camera", -Math.PI / 2, Math.PI / 2 - Math.PI / 10, distance, new Vector3(0, 0, 0));

    // Clipping
    this.minZ = 0.1;

    // Controls sensativity
    this.panningSensibility = 100;
    this.angularSensibilityX = 800;
    this.angularSensibilityY = 800;

    // Get canvas from scene
    const canvas = scene.getEngine().getRenderingCanvas();

    // Attaches camera canvas
    this.attachControl(canvas, true);

    // Monitors camera attachment
    store.set("attachCameraControl", true);
    store.watch("attachCameraControl", this, (value) => {
      this.attachControl(canvas, value);
    });
  }
}
