import { SceneLoader, MeshBuilder } from "@babylonjs/core";
import Registry from "babylonjs/meshes/MeshRegistry";

export default class MeshLoader {
  constructor(materialLoader) {
    this._scene = null;
    this._materialLoader = materialLoader;
  }

  attachScene(scene) {
    this._scene = scene;
  }

  load(toLoad) {
    let data = Registry[toLoad];

    if (!data) {
      return null;
    }

    let mesh = null;
    if (data.url) {
      SceneLoader.ImportMesh("", data.url, null, this._scene, function (meshes) {
        mesh = meshes[0];
        mesh.material = this._materialLoader.load(data.material);
      });
    } else if (data.create) {
      let type = Object.keys(data.create)[0];
      switch (type) {
        case "box":
          let dimensions = data.create[type];
          mesh = MeshBuilder.CreateBox(toLoad, { height: dimensions[0], width: dimensions[1], depth: dimensions[2] }, this._scene);
          mesh.material = this._materialLoader.load(data.material);
          break;
      }
    } else {
      return null;
    }

    mesh.metadata = {};
    mesh.metadata.id = data.id;
    return mesh;
  }
}
