import React from "react";
import PlaygroundComponent from "./components/playground/PlaygroundComponent"; // uses above component in same directory

import logo from './logo.svg';
import './App.css';

function App() {

  return (
    <div className="App">
      <PlaygroundComponent></PlaygroundComponent>
    </div>
  );
}

export default App;