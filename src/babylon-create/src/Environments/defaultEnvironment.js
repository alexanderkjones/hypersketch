import { CubeTexture } from "@babylonjs/core";

export class DefaultEnvironment {
  constructor(scene) {
    // Our environment
    this.environmentHelper = scene.createDefaultEnvironment({
      createSkybox: true,
      skyboxSize: 200,
      enableGroundShadow: true,
      groundYBias: 1,
      createGround: true,
      groundSize: 200,
    });

    // Make environment unpickable
    this.environmentHelper.ground.isPickable = false;
    this.environmentHelper.skybox.isPickable = false;

    // HDRI environment texture
    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData("./environment.env", scene);
  }
}
