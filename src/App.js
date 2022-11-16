import React from "react";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import PlaygroundComponent from "./components/playground/PlaygroundComponent"; // uses above component in same directory
import EditorPage from "./pages/Editor/Editor";

import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <Box className="App" sx={{ display: 'flex' }}>
      <CssBaseline />
      <EditorPage></EditorPage>
    </Box>
  );
}

export default App;
