import { Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setFrameRate } from '../../slices/FrameRateSlice';
import SceneComponent from '../babylon/SceneComponent';
import SliderComponent from './SliderComponent';
import ButtonBarComponent from './ButtonBarComponent';

import { SceneManager } from '../../babylonjs/SceneManager';

const PlaygroundComponent = (props) => {
  let sceneManager = new SceneManager();

  const dispatch = useDispatch();

  // Will execute once when scene is ready
  const onSceneReady = (scene) => {
    sceneManager.buildDefaultScene(scene);
    sceneManager.attachMouseInputController();
    sceneManager.attachKeyboardInputController();
  };

  //Will run on every frame render.  We are spinning the box on y-axis.
  const onRender = (scene, engine) => {
    dispatch(setFrameRate(engine.getFps().toFixed()));
    //refFPS.current = engine.getFps().toFixed();
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SceneComponent
            antialias
            onSceneReady={onSceneReady}
            onRender={onRender}
            id="viewport"
          ></SceneComponent>
        </Grid>

        <Grid item xs={12}>
          <ButtonBarComponent
            toUpdate={sceneManager.updateMenuSelection}
            activeButton={sceneManager.menuSelection}
          ></ButtonBarComponent>
        </Grid>

        <Grid item xs={6}>
          <SliderComponent
            toUpdate={sceneManager.updateSelectedMesh}
            type={'rotation_y'}
          ></SliderComponent>
        </Grid>
        <Grid item xs={6}>
          <SliderComponent
            toUpdate={sceneManager.updateSelectedMesh}
            type={'rotation_x'}
          ></SliderComponent>
        </Grid>
      </Grid>
    </div>
  );
};

export default PlaygroundComponent;
