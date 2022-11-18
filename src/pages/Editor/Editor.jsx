// MUI
import Box from '@mui/material/Box';

// Components
import Editor from "babylonjs/scenes/editor/Editor";
import EditorUI from "./EditorUI/EditorUI"
import SceneComponent from "components/babylon/SceneComponent";

export default function EditorPage(props) {
  const editor = new Editor();

  const onSceneReady = (scene) => {
    editor.attachScene(scene);
  };

  const onRender = (scene, engine) => {
    //dispatch(setFrameRate(engine.getFps().toFixed()));
  };

  return (
    <Box sx={{ height: "100%" }}>
    
      
      <EditorUI />
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="viewport"></SceneComponent>
      
    </Box>
  );
}
