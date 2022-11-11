import { SceneLoader } from '@babylonjs/core';

export class MeshManager{
  constructor(){
    this._scene = null;
    this._loader = new SceneLoader()
  }

  attachScene(scene){
    this._scene = scene;
  }

  


}