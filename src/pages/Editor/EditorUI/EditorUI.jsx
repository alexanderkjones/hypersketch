import { useState } from "react";

// MUI
import Box from "@mui/material/Box";

// Components
import EditorMenu from "./EditorMenu";
import EditorQuickToolbar from "./EditorQuickToolbar";
import EditorStats from "./EditorStats";
import EditorLibrary from "./EditorLibrary/EditorLibrary";

export default function EditorUI(props) {
  const [openLibrary, setOpenLibrary] = useState(false);
  const [toolbarValue, setToolbarValue] = useState(null);

  const { setEditorRequest } = props;

  return (
    <Box>
      <EditorMenu />
      <EditorLibrary openLibrary={openLibrary} setOpenLibrary={setOpenLibrary} setToolbarValue={setToolbarValue} setEditorRequest={setEditorRequest} />
      <EditorQuickToolbar toolbarValue={toolbarValue} setToolbarValue={setToolbarValue} setOpenLibrary={setOpenLibrary} setEditorRequest={setEditorRequest} />
      <EditorStats />
    </Box>
  );
}
