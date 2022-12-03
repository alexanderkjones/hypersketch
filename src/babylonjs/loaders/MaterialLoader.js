import { PBRMetallicRoughnessMaterial, Color3 } from "@babylonjs/core";
import { store } from "babylonjs/gloabls";
import Registry from "babylonjs/materials/MaterialRegistry";

class MaterialLoader {
  constructor() {
    this._scene = null;
    this._watchStore();
  }

  _watchStore() {
    store.watch("attachedScene", this, (scene) => {
      this._scene = scene;
    });
  }

  load(materialRegistyId) {
    let data = Registry[materialRegistyId];
    if (!data) {
      return null;
    }

    let material = null;
    for (const loadedMaterial of this._scene.materials) {
      if (loadedMaterial.name == materialRegistyId) {
        material = loadedMaterial;
      }
    }

    if (!material) {
      material = this._generateMaterial(materialRegistyId, data);
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

export const materialLoader = new MaterialLoader();
