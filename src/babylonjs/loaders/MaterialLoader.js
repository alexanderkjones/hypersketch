import { PBRMetallicRoughnessMaterial, Color3 } from "@babylonjs/core";
import Registry from "babylonjs/materials/MaterialRegistry";

export default class MaterialLoader {
  constructor() {
    this._scene = null;
  }

  attachScene(scene) {
    this._scene = scene;
  }

  load(name) {
    let data = Registry[name];
    if (!data) {
      return null;
    }

    let material = null;
    for (const loadedMaterial of this._scene.materials) {
      if (loadedMaterial.name == name) {
        material = loadedMaterial;
      }
    }

    if (!material) {
      material = this._generateMaterial(name, data);
    }

    return material;
  }

  _generateMaterial(name, data) {
    let material = null;
    switch (data.type) {
      case "PBRMetallicRoughness":
        material = new PBRMetallicRoughnessMaterial(name, this._scene);
        for (const key in data.settings) {
          console.log(key);
          switch (key) {
            case "baseColor":
              material[key] = Color3.FromHexString(data.settings[key]);
              break;
            default:
              material[key] = data.settings[key];
          }
        }
        break;
    }

    return material;
  }
}
