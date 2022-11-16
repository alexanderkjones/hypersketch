import { useState } from "react";
import { Grid } from "@mui/material";
import MenuButton from "./EditorToolbarButton";

export default function EditorToolbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container>
      <Grid item>
        <MenuButton title="New" actions={["Extrusion"]}></MenuButton>
      </Grid>
      <Grid item>
        <MenuButton title="Modify" actions={["Move", "Rotate", "Scale"]}></MenuButton>
      </Grid>
    </Grid>
  );
}
