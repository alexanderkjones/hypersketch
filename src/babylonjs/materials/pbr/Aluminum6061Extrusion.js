import { PBRMetallicRoughnessMaterial, Color3 } from '@babylonjs/core';

export const Aluminum6061Extrusion = (scene) => {
  let material = new PBRMetallicRoughnessMaterial(
    'Aluminum6061Extrusion',
    scene
  );
  material.baseColor = new Color3(0.3, 0.3, 0.3);
  material.metallic = 0.8;
  material.roughness = 0.2;
  return material;
};
