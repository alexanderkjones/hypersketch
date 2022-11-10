import { GrabAction } from './GrabAction';
import { MoveAction } from './MoveAction';
import { ScaleAction } from './ScaleAction';
import { RotateAction } from './RotateAction';
import { JointAction } from './JointAction';

export class EditorActions {
  constructor(scene=null) {
    this._scene = scene;
    this._attachedMesh = null;
    this.actions = {
      grabAction: null,
      moveAction: null,
      scaleAction: null,
      rotateAction: null,
      jointAction: null,
    };
  }

  attachMesh(mesh) {
    this._attachedMesh = mesh;
  }

  clearActions() {
    Object.values(this.actions).forEach((action) => {
      if(action){
        action.dispose();
      }
    });
  }

  set grabActionEnabled(value) {
    if (value) {
      if(!this.actions.grabAction) {
        this.actions.grabAction = new GrabAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.grabAction.attachMesh(this._attachedMesh);
      }
    } else {
      if (this.actions.grabAction) {
        this.actions.grabAction.dispose();
      }
    }
  }

  set moveActionEnabled(value, axis=null) {
    if (value) {
      if(!this.actions.grabAction) {
        this.actions.moveAction = new MoveAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.moveAction.attachMesh(this._attachedMesh);
      }
      if(axis){
        this.actions.moveAction.axis(axis);
      }
    } else {
      if (this.actions.moveAction) {
        this.actions.moveAction.dispose();
      }
    }
  }

  set scaleActionEnabled(value, axis=null) {
    if (value) {
      if(!this.actions.scaleAction) {
        this.actions.scaleAction = new ScaleAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.scaleAction.attachMesh(this._attachedMesh);
      }
      if(axis) {
        this.actions.scaleAction.axis(axis);
      }
    } else {
      if (this.actions.moveAction) {
        this.actions.scaleAction.dispose();
      }
    }
  }

  set rotateActionEnabled(value, axis=null) {
    if (value) {
      if(!this.actions.rotateAction) {
        this.actions.rotateAction = new RotateAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.rotateAction.attachMesh(this._attachedMesh);
      }
      if(axis) {
        this.actions.rotateAction.axis(axis);
      }
    } else {
      if (this.actions.rotateAction) {
        this.actions.rotateAction.dispose();
      }
    }
  }

  set jointActionEnabled(value) {
    if (value) {
      if(!this.actions.jointAction) {
        this.actions.jointAction = new jointAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.jointAction.attachMesh(this._attachedMesh);
      }
      if(axis) {
        this.actions.jointAction.axis(axis);
      }
    } else {
      if (this.actions.jointAction) {
        this.actions.jointAction.dispose();
      }
    }
  }
}