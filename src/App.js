// App.js
import React from "react";
import './index.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import MisEventos from "./vistasduenioevento/MisEventos";
import EntradasVendidas from "./vistasduenioevento/EntradasVendidas";
import CancelarEvento from "./vistasduenioevento/CancelarEvento";
import DatosPersonales from "./vistas/DatosPersonales";
import EventosAValidar from "./vistasadmin/EventosAValidar";
import EventoAValidar from "./vistasadmin/EventoAValidar";
import ModifDeEvento from "./vistasduenioevento/ModifDeEvento";
import ModificarEliminarNoticias from "./vistasadmin/ModificarEliminarNoticias";
import ModificarEliminarArtistas from "./vistasadmin/ModificarEliminarArtistas";
import EditarArtista from "./vistasadmin/EditarArtista";
import EditarNoticia from "./vistasadmin/EditarNoticia";
import PreCrearEvento from "./vistas/PreCrearEvento";
import MisFiestasRecurrentes from "./vistasduenioevento/MisFiestasRecurrentes";
import ReseniasDeLaFiesta from "./vistasduenioevento/ReseniasDeLaFiesta";
import EntradaAdquirida from "./vistas/EntradaAdquirida";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" exact element={<Inicio />} />
          <Route path="/crearevento" element={<CrearEvento />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/evento/:nombre" element={<Evento />} />
          <Route path="/comprar" element={<Comprar />} />
          <Route path="/artistas" element={<Artistas />} />
          <Route path="/artistas/:id" element={<Artista />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<Noticia />} />
          <Route path="/comollegar/:nombre" element={<ComoLlegar />} />
          <Route path="/entradasadquiridas" element={<EntradasAdquiridas />} />
          <Route path="/eventosfavoritos" element={<EventosFavoritos />} />
          <Route path="/datospersonales" element={<DatosPersonales />} />
          <Route path="/precrearevento" element={<PreCrearEvento />} />
          <Route path="/entrada-adquirida" element={<EntradaAdquirida />} />
          {/* Rutas para duenioevento */}
          <Route path="/miseventos" element={<MisEventos />} />
          <Route path="/entradas-vendidas/:eventoId" element={<EntradasVendidas />} />
          <Route path="/cancelar-evento/:id" element={<CancelarEvento />} />
          <Route path="/modificar-evento/:id" element={<ModifDeEvento />} />
          <Route path="/misfiestasrecurrentes" element={<MisFiestasRecurrentes />} />
          <Route path="/resenias-de-la-fiesta" element={<ReseniasDeLaFiesta />} />
          {/* Rutas para administrador */}
          <Route path="/eventosavalidar" element={<EventosAValidar />} />
          <Route path="/eventoavalidar" element={<EventoAValidar />} />
          <Route path="/modifeliminarnoticias" element={<ModificarEliminarNoticias />} />
          <Route path="/modifeliminarartistas" element={<ModificarEliminarArtistas />} />
          <Route path="/editarartista" element={<EditarArtista />} />
          <Route path="/editarnoticia" element={<EditarNoticia />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


// import React from "react";
// import './index.css';
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes
// } from "react-router-dom";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import CrearEvento from "./vistas/CrearEvento";
// import Inicio from "./vistas/Inicio";
// import Evento from "./vistas/Evento";
// import Comprar from "./vistas/Comprar";
// import Artistas from "./vistas/Artistas";
// import Artista from "./vistas/Artista";
// import Noticias from "./vistas/Noticias";
// import Noticia from "./vistas/Noticia";
// import ComoLlegar from "./vistas/ComoLlegar";
// import EntradasAdquiridas from "./vistas/EntradasAdquiridas";
// import EventosFavoritos from "./vistas/EventosFavoritos";
// import MisEventos from "./vistasduenioevento/MisEventos";
// import EntradasVendidas from "./vistasduenioevento/EntradasVendidas";
// import CancelarEvento from "./vistasduenioevento/CancelarEvento";
// import DatosPersonales from "./vistas/DatosPersonales";
// import EventosAValidar from "./vistasadmin/EventosAValidar";
// import EventoAValidar from "./vistasadmin/EventoAValidar";
// import ModifDeEvento from "./vistasduenioevento/ModifDeEvento";
// import ModificarEliminarNoticias from "./vistasadmin/ModificarEliminarNoticias";
// import ModificarEliminarArtistas from "./vistasadmin/ModificarEliminarArtistas";
// import EditarArtista from "./vistasadmin/EditarArtista";
// import EditarNoticia from "./vistasadmin/EditarNoticia";
// import PreCrearEvento from "./vistas/PreCrearEvento";
// import MisFiestasRecurrentes from "./vistasduenioevento/MisFiestasRecurrentes";
// import ReseniasDeLaFiesta from "./vistasduenioevento/ReseniasDeLaFiesta";
// import EntradaAdquirida from "./vistas/EntradaAdquirida";

// function App() {
//   return (
    
//     <Router>
    
//       <Routes>
//         <Route path="/" exact element={<Inicio />} />
//         <Route path="/crearevento" element={<CrearEvento />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/evento/:nombre" element={<Evento />} />
//         <Route path="/comprar" element={<Comprar />} />
//         <Route path="/artistas" element={<Artistas />} />
//         <Route path="/artistas/:nombre" element={<Artista />} />
//         <Route path="/noticias" element={<Noticias />} />
//         {/* <Route path="/noticias/:noticia" element={<Noticia />} /> */}
//         <Route path="/noticias/:id" element={<Noticia />} />
//         <Route path="/comollegar/:nombre" element={<ComoLlegar />} />
//         <Route path="/entradasadquiridas" element={<EntradasAdquiridas />} />
//         <Route path="/eventosfavoritos" element={<EventosFavoritos />} />  
//         <Route path="/datospersonales" element={<DatosPersonales />} />
//         <Route path="/precrearevento" element={<PreCrearEvento />} />
//         <Route path="/entrada-adquirida" element={<EntradaAdquirida />} />
        
//         {/* ----RutasDuenioEvento---- */}
//         <Route path="/miseventos" element={<MisEventos />} />
//         <Route path="/entradas-vendidas/:eventoId" element={<EntradasVendidas />} />
//         <Route path="/cancelar-evento/:id" element={<CancelarEvento />} />
//         <Route path="/modificar-evento/:id" element={<ModifDeEvento />} />
//         <Route path="/misfiestasrecurrentes" element={<MisFiestasRecurrentes />} />
//         <Route path="/resenias-de-la-fiesta" element={<ReseniasDeLaFiesta />} />
        
//         {/* ----RutasAdministrador---- */}
//         <Route path="/eventosavalidar" element={<EventosAValidar />} />
//         <Route path="/eventoavalidar" element={<EventoAValidar />} />
//         <Route path="/modifeliminarnoticias" element={<ModificarEliminarNoticias />} />
//         <Route path="/modifeliminarartistas" element={<ModificarEliminarArtistas />} />
//         <Route path="/editarartista" element={<EditarArtista />} />
//         <Route path="/editarnoticia" element={<EditarNoticia />} />

//       </Routes>

//     </Router>

//   );
// }

// export default App;
