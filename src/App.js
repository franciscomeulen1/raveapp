import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
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
import ModifDatosPersonales from "./vistas/ModifDatosPersonales";
import EventosAValidar from "./vistas/EventosAValidar";
import EventoAValidar from "./vistas/EventoAValidar";
import ModifDeEvento from "./vistas/ModifDeEvento";
import ModificarEliminarNoticias from "./vistasadmin/ModificarEliminarNoticias";
import ModificarEliminarArtistas from "./vistasadmin/ModificarEliminarArtistas";


function App() {
  return (
    
    <Router>
    
      <Routes>
        <Route path="/" exact element={<Inicio />} />
        <Route path="/crearevento" element={<CrearEvento />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/modificar-evento/:id" element={<ModifDeEvento />} />
        <Route path="/modifdatospersonales" element={<ModifDatosPersonales />} />
        <Route path="/eventosavalidar" element={<EventosAValidar />} />
        <Route path="/eventoavalidar" element={<EventoAValidar />} />
        {/* ----RutasAdministrador---- */}
        <Route path="/modifeliminarnoticias" element={<ModificarEliminarNoticias />} />
        <Route path="/modifieliminarartistas" element={<ModificarEliminarArtistas />} />

      </Routes>

    </Router>

  );
}

export default App;
