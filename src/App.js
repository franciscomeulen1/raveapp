// App.js
import React from "react";
import './index.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import MiPerfil from "./vistas/MiPerfil";
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
import CrearNoticia from "./vistasadmin/CrearNoticia";
import CrearArtista from "./vistasadmin/CrearArtista";
import EditarCarousel from "./vistasadmin/EditarCarousel";
import ActualizarTyC from "./vistasadmin/ActualizarTyC";

function App() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={clientId}>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" exact element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/evento/:id" element={<Evento />} />
          <Route path="/comprar" element={<Comprar />} />
          <Route path="/artistas" element={<Artistas />} />
          <Route path="/artistas/:id" element={<Artista />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<Noticia />} />
          <Route path="/comollegar/:nombre" element={<ComoLlegar />} />
          <Route path="/precrearevento" element={<PreCrearEvento />} />
          {/* Rutas para usuarios logueados */}
          <Route path="/crearevento" element={<CrearEvento />} />
          <Route path="/mis-entradas" element={<EntradasAdquiridas />} />
          <Route path="/eventos-favoritos" element={<EventosFavoritos />} />
          <Route path="/miperfil" element={<MiPerfil />} />
          <Route path="/entrada-adquirida" element={<EntradaAdquirida />} />
          {/* Rutas para organizadores */}
          <Route path="/mis-eventos-creados" element={<MisEventos />} />
          <Route path="/entradas-vendidas/:eventoId" element={<EntradasVendidas />} />
          <Route path="/cancelar-evento/:id" element={<CancelarEvento />} />
          <Route path="/modificar-evento/:id" element={<ModifDeEvento />} />
          <Route path="/mis-fiestas-recurrentes" element={<MisFiestasRecurrentes />} />
          <Route path="/resenias-de-la-fiesta" element={<ReseniasDeLaFiesta />} />
          {/* Rutas para administrador */}
          <Route path="/eventosavalidar" element={<EventosAValidar />} />
          <Route path="/eventoavalidar" element={<EventoAValidar />} />
          <Route path="/modificar-eliminar-noticias" element={<ModificarEliminarNoticias />} />
          <Route path="/modificar-eliminar-artistas" element={<ModificarEliminarArtistas />} />
          <Route path="/editar-artista/:id" element={<EditarArtista />} />
          <Route path="/editar-noticia/:id" element={<EditarNoticia />} />
          <Route path="/crear-noticia" element={<CrearNoticia />} />
          <Route path="/crear-artista" element={<CrearArtista />} />
          <Route path="/editar-carrusel" element={<EditarCarousel />} />
          <Route path="/actualizar-tyc" element={<ActualizarTyC />} />
          
        </Routes>
      </Router>
    </AuthProvider>
    </GoogleOAuthProvider>
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
