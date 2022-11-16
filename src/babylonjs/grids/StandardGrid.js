import { MeshBuilder, Color3 } from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

export const standardGrid = (scene, width = 10, height = 10) => {
  // Material for our grid
  var gridMaterial = new GridMaterial("groundMaterial", scene);
  gridMaterial.gridRatio = 0.1;
  gridMaterial.backFaceCulling = false;
  gridMaterial.mainColor = new Color3(1, 1, 1);
  gridMaterial.lineColor = new Color3(1.0, 1.0, 1.0);
  gridMaterial.opacity = 0.5;

  // Our built-in 'ground' shape.
  var grid = MeshBuilder.CreateGround("ground", { width: width, height: height }, scene);
  grid.material = gridMaterial;

  return grid;
};
