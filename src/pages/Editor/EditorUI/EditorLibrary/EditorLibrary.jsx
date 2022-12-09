import { useState } from "react";
import { styled } from "@mui/material/styles";

// MUI Components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Custom components
import LibraryParts from "./EditorLibraryParts";

export default function EditorLibrary(props) {
  const { openLibrary, setOpenLibrary, setToolbarValue, setEditorRequest } = props;
  const [selectedTab, setSelectedTab] = useState("quickstart")
  const [contentRoute, setContentRoute] = useState("quickstart");

  const onTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setContentRoute(newValue);
  };

  const onSelected = (value) => {
    // set command here from part
    setEditorRequest({action:"addMesh", argument:"enabled", value: value});
    handleClose();
  };

  const handleClose = () => {
    setToolbarValue(null);
    setOpenLibrary(false);
  };

  // MUI Dialog paper styles
  const PaperProps = {
    style: {
      maxHeight: "70%",
      minHeight: "70%",
      borderRadius: 10,      
    },
  };

  // MUI component style overrides
  const sx = {
    LibraryTitle: {
      bgcolor: "#dee4e4",
      p: "0"
    },

    LibraryTabs: {
      bgcolor: "#dee4e4",
      color: "#656969",
      boxShadow: 1,
    },

    LibraryFooter: {
      bgcolor: "#dee4e4",
      boxShadow: '0px -2px 1px -1px rgb(0 0 0 / 20%), 0px -1px 1px 0px rgb(0 0 0 / 14%), 0px -1px 3px 0px rgb(0 0 0 / 12%)',
      // TODO: look at this max height issue...
      minHeight: "30px",
    },
  };

  return (
    <Dialog fullWidth={true} maxWidth="lg" scroll="paper" open={openLibrary} onClose={handleClose} PaperProps={PaperProps}>
      <Box sx={sx.LibraryTitle}>
        <StyledTabs sx={sx.LibraryTabs} value={selectedTab} onChange={onTabChange}>
          <StyledTab label="QuickStart" value="quickstart" />
          <StyledTab label="Structure" value="structure" />
          <StyledTab label="Motion" value="motion" />
          <StyledTab label="Electronics" value="electronics" />
          <StyledTab label="Cosmetic" value="cosmetic" />
        </StyledTabs>
      </Box>
      <DialogContent dividers="true">
        <LibraryParts contentRoute={contentRoute} onSelected={onSelected}/>
      </DialogContent>
      <Box sx={sx.LibraryFooter}></Box>
    </Dialog>
  );
}

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 50,
    width: '100%',
    backgroundColor: '#656969',
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
    marginRight: theme.spacing(1),
    color: '#656969',
    '&.MuiButtonBase-root': { height: "100%" },
    '&.Mui-selected': {
      color: '#656969',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);

