import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";

export default function EditorMenu(props) {
  const [active, setActive] = useState({ id: null, target: null });
  return (
    <Box
      position="fixed"
      align="left"
      sx={{
        pl: "10px",
        pt: "2px",
        pb: "20px",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        bgcolor: "#dee4e4",
        borderBottom: 1,
        boxShadow: 2,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      {/* <EditorMenuButton name="File" active={active} setActive={setActive} />
      <EditorMenuButton name="Edit" active={active} setActive={setActive} />
      <EditorMenuButton name="View" active={active} setActive={setActive} /> */}
    </Box>
  );
}

function EditorMenuButton(props) {
  const { name, active, setActive } = props;

  let anchorEl = null;
  let open = false;

  const handleClose = () => {
    //setAnchorEl(null);
    anchorEl = null;
    open = false;
    console.log("Mouse Leave: " + name);
  };

  if (active.id == name) {
    anchorEl = active.anchorEl;
    open = true;
  } else {
    handleClose();
  }

  const handleMouseOver = (event) => {
    let newActive = { id: name, anchorEl: event.currentTarget };
    setActive(newActive);
    console.log("Mouse Enter: " + name);
  };

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  //   console.log(event.currentTarget)
  // };

  return (
    <div>
      <Button id="basic-button" size="small" aria-controls={open ? "basic-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} onMouseEnter={handleMouseOver} onMouseOut={handleClose} sx={{ textTransform: "none", minWidth: "30px", color: "#656969" }}>
        <ViewSidebarOutlinedIcon fontSize="medium" />
        <KeyboardArrowDownIcon fontSize="10px" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuList dense>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
