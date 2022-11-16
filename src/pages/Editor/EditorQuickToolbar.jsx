import { useState } from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import ExpandIcon from "@mui/icons-material/Expand";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

export default function EditorQuickToolbar(props) {
  const [value, setValue] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box position="absolute" sx={{ top: "35%", left: "10px", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <ToggleButtonGroup orientation="vertical" sx={{ bgcolor: "#dee4e4" }} value={value} exclusive onChange={handleChange}>
        <ToggleButton value="grab" aria-label="move">
          <NearMeOutlinedIcon />
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
        <ToggleButton value="play" aria-label="play">
          <PlayCircleOutlineIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
