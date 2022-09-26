import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes
} from "react-router-dom";
import CrearEvento from "./vistas/CrearEvento";
import Inicio from "./vistas/Inicio";

function App() {
  return (
    <Router>
    
      <Routes>
        <Route path="/" exact element={<Inicio />} />
        <Route path="/crearevento" element={<CrearEvento />} />
      </Routes>

    </Router>

  );
}

export default App;
