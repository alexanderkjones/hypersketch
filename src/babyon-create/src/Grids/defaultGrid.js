import { MeshBuilder, Color3 } from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";
import { store } from "../Globals";

export class DefualtGrid {
  constructor(scene, width = 10, height = 10) {
    // Material for our grid
    const gridMaterial = new GridMaterial("groundMaterial", scene);
    gridMaterial.gridRatio = 0.1;
    gridMaterial.backFaceCulling = false;
    gridMaterial.mainColor = new Color3(1, 1, 1);
    gridMaterial.lineColor = new Color3(1.0, 1.0, 1.0);
    gridMaterial.opacity = 0.5;

    // Our built-in 'ground' shape.
    this.grid = MeshBuilder.CreateGround("ground", { width: width, height: height }, scene);
    this.grid.material = gridMaterial;

    // Monitor grid visibility
    store.set("gridEnabled", true);
    store.watch("gridEnabled", this, (value) => {
      this.grid.isEnabled(value);
    });
  }
}
