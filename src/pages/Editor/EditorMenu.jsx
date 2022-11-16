import Box from "@mui/material/Box";

export default function EditorMenu(props) {
  return (
    <Box
      position="fixed"
      sx={{
        width: "100%",
        bgcolor: "#dee4e4",
        borderBottom: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      Hello
    </Box>
  );
}
