import { SceneLoader, MeshBuilder } from "@babylonjs/core";
import { store } from "../Globals";
import { materialLoader } from "./materialLoader";
import Registry from "../Meshes/MeshRegistry";

class MeshLoader {
  constructor() {
    this._scene = null;
    this._watchStore();
  }

  _watchStore() {
    store.watch("attachedScene", this, (scene) => {
      this._scene = scene;
    });
  }

  load(meshRegistryId) {
    let data = Registry[meshRegistryId];
    if (!data) {
      return null;
    }
    let mesh = null;
    if (data.url) {
      SceneLoader.ImportMesh("", data.url, null, this._scene, function (meshes) {
        mesh = meshes[0];
        mesh.material = materialLoader.load(data.material);
      });
    } else if (data.create) {
      const type = Object.keys(data.create)[0];
      switch (type) {
        case "box":
          const dimensions = data.create[type];
          mesh = MeshBuilder.CreateBox(toLoad, { height: dimensions[0], width: dimensions[1], depth: dimensions[2] }, this._scene);
          this._store.set("materialToLoad", { mesh: mesh, material: data.material });
          //mesh.material = this._materialLoader.load(data.material);
          break;
      }
    } else {
      return null;
    }

    mesh.metadata = {};
    mesh.metadata.id = data.id;
    return mesh;
  }

  unload(mesh) {
    mesh.dispose();
  }
}

export const meshLoader = new MeshLoader();
