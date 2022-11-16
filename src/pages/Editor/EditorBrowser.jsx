import Drawer from "@mui/material/Drawer";

export default function EditorBrowser(props) {
  const { open } = props;

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      sx={{
        width: 300,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 300, boxSizing: "border-box" },
      }}
    >
    </Drawer>
  );
}
