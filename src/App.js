import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Login from "./components/Login";
import CrearEvento from "./vistas/CrearEvento";
import Inicio from "./vistas/Inicio";
import Evento from "./vistas/Evento";

function App() {
  return (
    
    <Router>
    
      <Routes>
        <Route path="/" exact element={<Inicio />} />
        <Route path="/crearevento" element={<CrearEvento />} />
        <Route path="/login" element={<Login />} />
        <Route path="/evento" element={<Evento />} />

      </Routes>

    </Router>

  );
}

export default App;
