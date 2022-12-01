import { SceneLoader, MeshBuilder } from "@babylonjs/core";
import Registry from "babylonjs/meshes/MeshRegistry";

export default class MeshLoader {
  constructor() {
    this._store = null;
    this._scene = null;
  }

  attachStore(store) {
    this._store = store;
    this._store.watch("attachedScene", this, this.onSetAttachedScene);
    this._store.watch("meshToLoad", this, this.onSetMeshToLoad);
  }

  onSetAttachedScene = (scene) => {
    this._scene = scene;
  };

  onSetMeshToLoad(meshName) {
    let data = Registry[meshName];

    if (!data) {
      return null;
    }

    let mesh = null;
    if (data.url) {
      SceneLoader.ImportMesh("", data.url, null, this._scene, function (meshes) {
        mesh = meshes[0];
        this._store.set("materialToLoad", { mesh: mesh, material: data.material });
        //mesh.material = this._materialLoader.load(data.material);
      });
    } else if (data.create) {
      let type = Object.keys(data.create)[0];
      switch (type) {
        case "box":
          let dimensions = data.create[type];
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
}
