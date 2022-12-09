// import { TransformMeshCommand } from "../../Commands/MeshCommands";
// import { store, stack } from "../../Globals";
// import { PositionGizmo, RotationGizmo, ScaleGizmo } from "@babylonjs/core/Gizmos";

// export class MoveMeshAction {
//   constructor() {
//     this._scene = null;
//     this._attachedMesh = null;
//     this._attachedMeshInitState = { position: null, rotation: null, scaling: null };
//     this._gizmos = {};
//     this._gizmos.position = {enabled:false, _class: PositionGizmo, instance: null;}
//     this._gizmos.rotation = {enabled:false, _class: RotationGizmo, instance: null;}
//     this._gizmos.scaling = {enabled:false, _class: ScalingGizmo, instance: null;}
//     this._watchStore();
//   }

//   _watchStore() {
//     store.watch("attachedScene", this, (scene) => {
//       this._scene = scene;
//     });
//     store.watch("attachedMesh", this, this._onSetAttachedMesh);
//   }

//   process(request) {
//     const { action, argument, value, options } = request;
//     switch(argument){
//       case 'enabled':
//         if(value !== true || !options) return;
//           for(const key in this._gizmos){
//             const gizmo = this._gizmos[key];
//             if(!options[key]){
//               gizmo.enabled = false;
//               return;
//             }
//             gizmo.enabled = true;
//             gizmo.instance = new this._gizmos[gizmo]._class();
//             gizmo.instance.attachedMesh = this._attachedMesh;
//           }
//         break;
//       case 'set':
//         if(!this._attachedMesh || !value) return;
//         this._setTransform(this._getAttachedMeshState(), this._getMeshStateFromValue(value));
//         break;
//     }

//   }

//   _onSetAttachedMesh = (mesh) => {
//     this._attachedMesh = mesh;
//     for (const key in this._gizmos) {
//       const gizmo = this._gizmos[key];
//       if(gizmo.instance) gizmo.instance.dispose();
//     }
//     if (!this._attachedMesh) return;

//     for (const key in this._gizmos) {
//       const gizmo = this._gizmos[key];
//       if(gizmo.instance){
//         gizmo.instance.attachedMesh(this._attachedMesh);

//         gizmo.dragBehavior.onDragStartObservable.add(() => {
//           this._attachedMeshInitState = this._getAttachedMeshState();
//         });

//         this._gizmo.dragBehavior.onDragEndObservable.add(() => {
//           const command = new TransformMeshCommand(this._attachedMesh, this._attachedMeshInitState, this._getAttachedMeshState(), true);
//           stack.execute(command);
//         });

//       }
//     }

//   };

//   _getAttachedMeshState(){
//     const meshState = { position: null, rotation: null, scaling: null };
//     for(const state in meshState){
//       meshState[state] = this._attachedMesh[state].clone()
//     }
//     return meshState
//   }

//   _getMeshStateFromValue(value){
//     const meshState = { position: null, rotation: null, scaling: null };
//     for(const state in meshState){
//       value[state] ? meshState[state] = new Vector3(...value[state]) : continue;
//     }
//     return meshState;
//   }

//   _setTransform(initState, newState, executed = false){
//     stach.execute(new TransformMeshCommand(this._attachedMesh, initState, newState, executed));
//   }

//   dispose() {
//     this._attachedMesh = null;
//     this._attachedMeshStartPosition = null;
//     this._gizmo.dispose();
//     this._gizmo = null;
//   }
// }
