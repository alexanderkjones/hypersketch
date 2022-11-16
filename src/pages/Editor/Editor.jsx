import Box from '@mui/material/Box';

import EditorMenu from "./EditorMenu";
import EditorBrowser from "./EditorBrowser";
import EditorQuickToolbar from "./EditorQuickToolbar";
import EditorStats from "./EditorStats";
import EditorPartsLibrary from "./EditorPartsLibrary";

import Editor from "babylonjs/scenes/editor/Editor";
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
      <EditorMenu></EditorMenu>
      <EditorQuickToolbar/>
      <EditorStats/>
      
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="viewport"></SceneComponent>
      <EditorPartsLibrary />
    </Box>
  );
}
