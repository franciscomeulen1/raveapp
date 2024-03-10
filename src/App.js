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
import Comprar from "./vistas/Comprar";
import Artistas from "./vistas/Artistas";
import Artista from "./vistas/Artista";
import Noticias from "./vistas/Noticias";
import Noticia from "./vistas/Noticia";


function App() {
  return (
    
    <Router>
    
      <Routes>
        <Route path="/" exact element={<Inicio />} />
        <Route path="/crearevento" element={<CrearEvento />} />
        <Route path="/login" element={<Login />} />
        <Route path="/evento" element={<Evento />} />
        <Route path="/comprar" element={<Comprar />} />
        <Route path="/artistas" element={<Artistas />} />
        <Route path="/artistas/:nombre" element={<Artista />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticia" element={<Noticia />} />

      </Routes>

    </Router>

  );
}

export default App;
