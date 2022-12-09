import { useState } from "react";

// MUI
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// Icons
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import ExpandIcon from "@mui/icons-material/Expand";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";

export default function EditorQuickToolbar(props) {
  const { toolbarValue, setToolbarValue, setOpenLibrary, setEditorRequest } = props;

  const handleChange = (event, newValue) => {
    setToolbarValue(newValue);
    switch (newValue) {
      case "move":
        setEditorRequest({ action: "moveMesh", argument: "enabled", value: true });
        break;
      case "rotate":
        setEditorRequest({ action: "rotateMesh", argument: "enabled", value: true });
        break;
      case "scale":
        setEditorRequest({ action: "scaleMesh", argument: "enabled", value: true });
        break;
      case "library":
        setOpenLibrary(true);
        break;
    }
  };

  return (
    <Box position="absolute" sx={{ top: "35%", left: "10px", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <ToggleButtonGroup orientation="vertical" sx={{ bgcolor: "#dee4e4" }} value={toolbarValue} exclusive onChange={handleChange}>
        <ToggleButton value="grab" aria-label="move">
          <NearMeOutlinedIcon />
        </ToggleButton>
        <ToggleButton value="play" aria-label="play">
          <PlayCircleOutlineIcon />
        </ToggleButton>
        <ToggleButton value="move" aria-label="move">
          <OpenWithIcon />
        </ToggleButton>
        <ToggleButton value="rotate" aria-label="rotate">
          <Rotate90DegreesCcwIcon />
        </ToggleButton>
        <ToggleButton value="scale" aria-label="scale">
          <ExpandIcon />
        </ToggleButton>
        <ToggleButton value="library" aria-label="play">
          <LibraryAddOutlinedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
