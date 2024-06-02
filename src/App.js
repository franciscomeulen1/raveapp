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
import ComoLlegar from "./vistas/ComoLlegar";
import EntradasAdquiridas from "./vistas/EntradasAdquiridas";
import EventosFavoritos from "./vistas/EventosFavoritos";
import MisEventos from "./vistas/MisEventos";
import EntradasVendidas from "./vistas/EntradasVendidas";
import CancelarEvento from "./vistas/CancelarEvento";


function App() {
  return (
    
    <Router>
    
      <Routes>
        <Route path="/" exact element={<Inicio />} />
        <Route path="/crearevento" element={<CrearEvento />} />
        <Route path="/login" element={<Login />} />
        <Route path="/evento/:nombre" element={<Evento />} />
        <Route path="/comprar" element={<Comprar />} />
        <Route path="/artistas" element={<Artistas />} />
        <Route path="/artistas/:nombre" element={<Artista />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:noticia" element={<Noticia />} />
        <Route path="/comollegar/:nombre" element={<ComoLlegar />} />
        <Route path="/entradasadquiridas" element={<EntradasAdquiridas />} />
        <Route path="/eventosfavoritos" element={<EventosFavoritos />} />
        <Route path="/miseventos" element={<MisEventos />} />
        <Route path="/entradas-vendidas/:eventoId" element={<EntradasVendidas />} />
        <Route path="/cancelar-evento/:id" element={<CancelarEvento />} />

      </Routes>

    </Router>

  );
}

export default App;
