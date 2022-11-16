import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { styled } from '@mui/material/styles';

export default function MenuButton(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { title, logo, actions } = props;

  const handleMouseOver = (event) => {
    setAnchorEl(event.currentTarget);
    console.log("mouseOver");
    const timer = setTimeout(() => console.log("Hello, World!"), 30);
    return () => clearTimeout(timer);
  };

  const handleMouseOut = (event) => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const listItems = actions.map((action, index) => (
    <MenuItem key={index} onClick={handleClose}>
      {action}
    </MenuItem>
  ));

  return (
    <div>
      <Button size="small" sx={{color: '#dedede'}} id={title + "-button"} aria-controls={open ? title + "-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} onClick={handleMouseOver}>
        {title}
      </Button>
      <Menu
        id={title + "-menu"}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": title + "-button",
        }}
      >
        <MenuList dense>{listItems}</MenuList>
      </Menu>
    </div>
  );
}
