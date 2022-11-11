import { GrabAction } from './GrabAction';
import { MoveAction } from './MoveAction';
import { ScaleAction } from './ScaleAction';
import { RotateAction } from './RotateAction';
import { JointAction } from './JointAction';

export class EditorActions {
  constructor(scene=null) {
    this._scene = scene;
    this._attachedMesh = null;
    this.state = {
      action: null,
      modifier: null,
      selector: null,
      value: null,
    };
    this.actions = {
      grab: null,
      move: null,
      scale: null,
      rotate: null,
      joint: null,
    };
    this.actionsEnabled = {
      grab: false,
      move: false,
      scale: false,
      rotate: false,
      joint: false,
    };
  }

  attachScene(scene) {
    this._scene = scene;
    for(let key in this.actions){
      action = this.actions[key];
      if(action){
        action.attachScene(scene);
      }
    }

  }

  attachMesh(mesh) {
    this._attachedMesh = mesh;
    for(let key in this.actions){
      action = this.actions[key];
      if(action && this.actionsEnabled[key]){
        action.attachMesh(mesh);
      }
    }
  }

  disableAllActions() {
    Object.values(this.actions).forEach((action) => {
      if(action) action.dispose();
    });
    Object.keys(this.actionsEnabled).forEach((actionEnabled) => {
      actionEnabled = false;
    });
  }

  set grabActionEnabled(value) {
    if (value) {
      if(!this.actions.grab) {
        this.actions.grab = new GrabAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.grab.attachMesh(this._attachedMesh);
      }
    } else {
      if (this.actions.grab) {
        this.actions.grab.dispose();
      }
    }
  }

  set moveActionEnabled(value, axis=null) {
    if (value) {
      if(!this.actions.move) {
        this.actions.move = new MoveAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.move.attachMesh(this._attachedMesh);
      }
      if(axis){
        this.actions.move.axis(axis);
      }
    } else {
      if (this.actions.move) {
        this.actions.move.dispose();
      }
    }
  }

  set scaleActionEnabled(value, axis=null) {
    if (value) {
      if(!this.actions.scale) {
        this.actions.scale = new ScaleAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.scale.attachMesh(this._attachedMesh);
      }
      if(axis) {
        this.actions.scale.axis(axis);
      }
    } else {
      if (this.actions.scale) {
        this.actions.scale.dispose();
      }
    }
  }

  set rotateActionEnabled(value, axis=null) {
    if (value) {
      if(!this.actions.rotate) {
        this.actions.rotate = new RotateAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.rotate.attachMesh(this._attachedMesh);
      }
      if(axis) {
        this.actions.rotate.axis(axis);
      }
    } else {
      if (this.actions.rotate) {
        this.actions.rotate.dispose();
      }
    }
  }

  set jointActionEnabled(value) {
    if (value) {
      if(!this.actions.joint) {
        this.actions.joint = new JointAction(this._scene);
      }
      if(this._attachedMesh){
        this.actions.joint.attachMesh(this._attachedMesh);
      }
    } else {
      if (this.actions.joint) {
        this.actions.joint.dispose();
      }
    }
  }

  set addActionEnabled(value, url) {
    if (value) {
      if(!this.actions.add) {
        this.actions.add = new AddAction(this._scene);
      }
      this._attachedMesh = this.actions.add.loadMesh(url);
      if(this._attachedMesh){
        this.actions.add.attachMesh(this._attachedMesh);
      }
    } else {
      if (this.actions.joint) {
        this.actions.joint.dispose();
      }
    }
  }

  process(input) {
    // Actions
    if (input.action && input.action != this.state.action) {
      if(!Object.keys(this.actions).includes(input.action)){
        return;
      }
      this.disableAllActions();
      switch (input.action) {
        case 'grab':
          this.grabActionEnabled(true);
          this.state.action = input.action;
          break;
        case 'move':
          this.moveActionEnabled(true);
          this.state.action = input.action;
          break;
        case 'scale':
          this.scaleActionEnabled(true);
          this.state.action = input.action;
          break;
        case 'rotate':
          this.rotateActionEnabled(true);
          this.state.action = input.action;
          break;
        case 'joint':
          this.jointActionEnabled(true);
          this.state.action = input.action;
          break;
        case 'add' :
          this.addActionEnabled(true, input.value);
          this.state.action = input.action;
      }
      this.state.modifier = null;
    }

    // Modifiers
    if (input.modifier && input.modifier != this._mode.modfier) {
      switch (input.modifier) {
        case 'x':
          switch (this.state.action) {
            case 'move':
              this.actions.moveActionEnabled(true, 'x');
              this.state.modifier = input.modifier;
              break;
            case 'scale':
              this.actions.scaleActionEnabled(true, 'x');
              this.state.modifier = input.modifier;
              break;
            case 'rotate':
              this.actions.rotateActionEnabled(true, 'x');
            this.state.modifier = input.modifier;
              break;
          }
        break;
        case 'y':
          switch (this.state.action) {
            case 'move':
              this.actions.moveActionEnabled(true, 'y');
              this.state.modifier = input.modifier;
              break;
            case 'scale':
              this.actions.scaleActionEnabled(true, 'y');
              this.state.modifier = input.modifier;
              break;
            case 'rotate':
              this.actions.rotateActionEnabled(true, 'y');
            this.state.modifier = input.modifier;
              break;
          }
        break;
        case 'z':
          switch (this.state.action) {
            case 'move':
              this.actions.moveActionEnabled(true, 'z');
              this.state.modifier = input.modifier;
              break;
            case 'scale':
              this.actions.scaleActionEnabled(true, 'z');
              this.state.modifier = input.modifier;
              break;
            case 'rotate':
              this.actions.rotateActionEnabled(true, 'z');
              this.state.modifier = input.modifier;
              break;
          }
          break;
      }
    }

    // Values
    if (input.value) {
      switch (this.state.action) {
        case 'move':
          this.actions.move.value(input.value);
          break;
        case 'scale':
          this.actions.scale.value(input.value);
          break;
        case 'rotate':
          this.actions.rotate.value(input.value);
          break;
        case 'add':
          this.actions.add.value(input.value);
          break;
      }
    }
  }




}