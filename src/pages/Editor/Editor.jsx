// Store
import { useDispatch } from "react-redux";
import { setSceneProfile } from "slices/SceneProfileSlice";

// MUI
import Box from "@mui/material/Box";

// Components
import Editor from "babylonjs/scenes/editor/Editor";
import EditorUI from "./EditorUI/EditorUI";
import SceneComponent from "components/babylon/SceneComponent";

export default function EditorPage(props) {
  const editor = new Editor();
  const dispatch = useDispatch();

  const onSceneReady = (scene) => {
    editor.attachScene(scene);
  };

  const onRender = (scene) => {
    const profile = editor.profiler.get();
    dispatch(setSceneProfile(profile));
  };

  return (
    <Box sx={{ height: "100%" }}>
      <EditorUI setEditorAction={editor.setAction}/>
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="viewport"></SceneComponent>
    </Box>
  );
}
