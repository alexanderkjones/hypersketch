import { useEffect, useRef, useState } from 'react';
import {
  ArcRotateCamera,
  Vector3,
  Color3,
  MeshBuilder,
  HemisphericLight,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import SceneComponent from '../babylon//SceneComponent';
import SliderComponent from '../playground/SliderComponent';

let box;
let boxRotation = 0;

const BasicPlaygroundComponent = (props) => {
  // Will execute once when scene is ready
  const onSceneReady = (scene) => {
    // This creates and positions an arc rotate camera
    var camera = new ArcRotateCamera(
      'camera1',
      -Math.PI / 2,
      Math.PI / 2.5,
      75,
      new Vector3(0, 0, 0)
    );

    // Initialize canvase
    const canvas = scene.getEngine().getRenderingCanvas();

    // Attaches camera canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'box' shape.
    box = MeshBuilder.CreateBox('box', { size: 10 }, scene);

    // Move the box upward 1/2 its height
    box.position.y = 10;

    // Our built-in 'ground' shape.
    var ground = MeshBuilder.CreateGround(
      'ground',
      { width: 150, height: 150 },
      scene
    );
  };

  //Will run on every frame render.  We are spinning the box on y-axis.
  const onRender = (scene) => {
    box.rotation.y = boxRotation;
  };

  const updateBoxRotation = (val) => {
    boxRotation = (val / 100) * Math.PI * 2;
  };

  return (
    <div>
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="viewport"
      ></SceneComponent>
      <SliderComponent toUpdate={updateBoxRotation}></SliderComponent>
    </div>
  );
};

export default BasicPlaygroundComponent;
