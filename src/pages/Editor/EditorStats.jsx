// React
import { useSelector } from "react-redux";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Icons
import CastConnectedOutlinedIcon from "@mui/icons-material/CastConnectedOutlined";
import DeviceHubOutlinedIcon from "@mui/icons-material/DeviceHubOutlined";
import DetailsOutlinedIcon from "@mui/icons-material/DetailsOutlined";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";

export default function EditorStats() {
  //const {fps, vertices, faces, objects} = useSelector((state) => state.sceneStats.value);
  const { fps, vertices, faces, objects } = { fps: 60, vertices: 459801, faces: 153267, objects: 32 };

  const itemColor = "#dee4e4";
  const itemOffset = "10px";
  const iconOffset = "2px";

  return (
    <Box position="absolute" sx={{ display: "flex", flexDirection: "row", bottom: "10px", left: "10px", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Box>
        <Typography variant="body2" display="block" sx={{ color: itemColor, mr: itemOffset }}>
          <CastConnectedOutlinedIcon fontSize="inherit" style={{ position: "relative", top: iconOffset }} /> {fps}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" display="block" sx={{ color: itemColor, mr: itemOffset }}>
          <DeviceHubOutlinedIcon fontSize="inherit" style={{ position: "relative", top: iconOffset }} /> {vertices}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" display="block" sx={{ color: itemColor, mr: itemOffset }}>
          <DetailsOutlinedIcon fontSize="inherit" style={{ position: "relative", top: iconOffset }} /> {faces}
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" display="block" sx={{ color: itemColor, mr: itemOffset }}>
          <ViewInArOutlinedIcon fontSize="inherit" style={{ position: "relative", top: iconOffset }} /> {objects}
        </Typography>
      </Box>
    </Box>
  );
}
