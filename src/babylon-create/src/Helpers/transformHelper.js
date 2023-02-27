import { Vector3 } from "@babylonjs/core";
import { store } from "../Globals";

export class TransformHelper {
  constructor() {
    this._attachedMesh = null;
    this._stateInit = null;
    this._stateEnd = null;
    this._watchStore();
  }

  _watchStore() {
    store.watch("attachedMesh", this, this._onSetAttachedMesh);
  }

  _onSetAttachedMesh = (mesh) => {
    this._attachedMesh = mesh;
    this._clearStates();
  };

  getStateInit() {
    return this._stateInit;
  }

  setStateInit(state) {
    state ? (this._stateInit = this._generateState(state)) : (this._stateInit = this._getState());
  }

  getStateEnd() {
    return this._stateEnd;
  }

  setStateEnd(state) {
    state ? (this._stateEnd = this._generateState(state)) : (this._stateEnd = this._getState());
  }

  _generateState(value) {
    const state = this._getState();
    if (!value) return state;
    for (const key in value) {
      if (state[key]) state[key] = new Vector3(...value[key]);
    }
    return state;
  }

  _getState() {
    if (!this._attachedMesh) return null;
    const state = {
      position: this._attachedMesh.position.clone(),
      rotation: this._attachedMesh.rotation.clone(),
      scaling: this._attachedMesh.scaling.clone(),
    };
    return state;
  }

  _clearStates() {
    this._stateInit = null;
    this._stateEnd = null;
  }

  dispose() {
    this._attachedMesh = null;
    this._clearStates();
    store.unwatch(this);
  }
}
