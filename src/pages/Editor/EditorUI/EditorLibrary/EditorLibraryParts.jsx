import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { CardActionArea } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

// Part json files
import QuickStartCatalog from "./parts/quickstart.json";
import StructureCatalog from "./parts/structure/structure.json";

export default function EditorParts(props) {
  const { contentRoute, onSelected } = props;

  // Route catalog from content target
  let catalog = null;
  switch (contentRoute) {
    case "quickstart":
      catalog = QuickStartCatalog;
      break;
    case "structure":
      catalog = StructureCatalog;
      break;
    default:
      catalog = StructureCatalog;
  }

  const sx = {
    CardRow: {
      display: "flex",
    },
  };
  return (
    <Box>
      {catalog.map((list) => (
        <Box>
          <Typography variant="h5" textTransform="capitalize">
            {list.title}
          </Typography>
          <Divider />
          <Box sx={{ display: "flex" }}>
            {list.parts.map((part) => (
              <Part data={part} onSelected={onSelected} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function Part(props) {
  const { data, onSelected } = props;

  const handleClick = (value) => {
    onSelected(value);
  };

  const partName = data.id.replace("_", " ");

  return (
    <Card sx={{ maxWidth: "150px", mt: "20px", mb: "20px", mr: "20px" }}>
      <CardActionArea onClick={() => handleClick(data.id)}>
        <Box sx={{ p: "10px" }}>
          <CardMedia component="img" height="100" width="100" image={data.img} alt={partName} />
          <CardContent>
            <Typography variant="body2" align="center" textTransform="capitalize">
              {" "}
              {partName}{" "}
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}
