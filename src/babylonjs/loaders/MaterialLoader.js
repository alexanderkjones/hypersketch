import { PBRMetallicRoughnessMaterial, Color3 } from "@babylonjs/core";
import Registry from "babylonjs/materials/MaterialRegistry";

export default class MaterialLoader {
  constructor() {
    this._store = null;
    this._scene = null;
  }

  attachStore(store) {
    this._store = store;
    this._store.watch("attachedScene", this, this.onSetAttachedScene);
    this._store.watch("materialToLoad", this, this.onSetMaterialToLoad);
  }

  onSetAttachedScene = (scene) => {
    this._scene = scene;
  };

  onSetMaterialToLoad = (props) => {
    const { mesh, matName } = props;
    let data = Registry[matName];
    if (!data) {
      return null;
    }

    let material = null;
    for (const loadedMaterial of this._scene.materials) {
      if (loadedMaterial.name == matName) {
        material = loadedMaterial;
      }
    }

    if (!material) {
      material = this._generateMaterial(matName, data);
    }

    return material;
  };

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
