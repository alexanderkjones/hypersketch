import Registry from "./MaterialRegistry" assert { type: "json" };

export class MaterialLoader {
  constructor() {
    this._scene = null;
  }

  attachScene(scene) {
    this._scene = scene;
  }

  loadMaterial(name) {
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

  _generateMaterial(name, metadata) {
    switch (data.type) {
      case "PBRMetallicRoughness":
        let material = new PBRMetallicRoughnessMaterial(name, this._scene);
        for (const key in data.settings) {
          material[key] = data.settings[key];
        }
        break;
    }
  }
}
