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
import MisEntradas from "./vistas/MisEntradas";
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
import ProtectedRoutePorRol from "./components/ProtectedRoutePorRol";
import GraciasPorTuCompra from "./vistas/GraciasPorTuCompra";
import OlvideContrasena from "./vistas/OlvideContrasena";
import RestablecerContrasena from "./vistas/RestablecerContrasena";
import ConfirmacionMail from "./vistas/ConfirmacionMail";
import VerReporteDeVentas from "./vistasadmin/VerReporteDeVentas";
import ReporteVentasEvento from "./vistasadmin/ReporteVentasEvento";
import RequireAuthCrearEvento from "./components/componentsCrearEvento/RequireAuthCrearEvento";
import CrearUsuarioControlador from "./vistasduenioevento/CrearUsuarioControlador";



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
          <Route path="/artistas" element={<Artistas />} />
          <Route path="/artistas/:id" element={<Artista />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<Noticia />} />
          <Route path="/comollegar/:idEvento" element={<ComoLlegar />} />
          <Route path="/precrearevento" element={<PreCrearEvento />} />
          <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
          <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
          <Route path="/confirmacion-mail" element={<ConfirmacionMail />} />

          {/* Rutas para usuarios logueados */}

          {/* protegida */}
          <Route
            path="/crearevento"
            element={
              <RequireAuthCrearEvento>
                <CrearEvento />
              </RequireAuthCrearEvento>
            }
          />

          <Route path="/mis-entradas" element={
                <ProtectedRoutePorRol rolesPermitidos={[0]}>
                  <MisEntradas />
                </ProtectedRoutePorRol>
                } />
          
          <Route path="/eventos-favoritos" element={
                <ProtectedRoutePorRol rolesPermitidos={[0]}>
                  <EventosFavoritos />
                </ProtectedRoutePorRol>
                } />
          
          <Route path="/miperfil" element={
                <ProtectedRoutePorRol rolesPermitidos={[0]}>
                  <MiPerfil />
                </ProtectedRoutePorRol>
                } />
          
          <Route path="/entrada-adquirida" element={
                <ProtectedRoutePorRol rolesPermitidos={[0]}>
                  <EntradaAdquirida />
                </ProtectedRoutePorRol>
                } />

          <Route path="/comprar" element={
                <ProtectedRoutePorRol rolesPermitidos={[0]}>
                  <Comprar />
                </ProtectedRoutePorRol>
                } />

          <Route path="/gracias-por-tu-compra" element={
                <ProtectedRoutePorRol rolesPermitidos={[0]}>
                  <GraciasPorTuCompra />
                </ProtectedRoutePorRol>
                } />

          {/* Rutas para organizadores (cdRol = 2) */}

          <Route path="/mis-eventos-creados" element={
                <ProtectedRoutePorRol rolesPermitidos={[2]}>
                  <MisEventos />
                </ProtectedRoutePorRol>
                } />
          
          <Route path="/entradas-vendidas/:eventoId" element={
                <ProtectedRoutePorRol rolesPermitidos={[2]}>
                  <EntradasVendidas />
                </ProtectedRoutePorRol>
                } />
          
          <Route path="/cancelar-evento/:id" element={
                <ProtectedRoutePorRol rolesPermitidos={[2]}>
                  <CancelarEvento />
                </ProtectedRoutePorRol>
                } />
          
          <Route path="/modificar-evento/:id" element={
                <ProtectedRoutePorRol rolesPermitidos={[2]}>
                  <ModifDeEvento />
                </ProtectedRoutePorRol>
                } />

          <Route path="/mis-fiestas-recurrentes" element={
                <ProtectedRoutePorRol rolesPermitidos={[2]}>
                  <MisFiestasRecurrentes />
                </ProtectedRoutePorRol>
                } />
          
          <Route path="/resenias-de-la-fiesta/:id" element={
                <ProtectedRoutePorRol rolesPermitidos={[2]}>
                  <ReseniasDeLaFiesta />
                </ProtectedRoutePorRol>
                } />
                
          <Route path="/crear-usuario-controlador" element={
                <ProtectedRoutePorRol rolesPermitidos={[2]}>
                  <CrearUsuarioControlador />
                </ProtectedRoutePorRol>
                } />
          

          {/* Rutas para administrador (cdRol = 1) */}

          <Route path="/eventosavalidar" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                  <EventosAValidar />
                </ProtectedRoutePorRol>
                } />

          <Route path="/eventoavalidar/:idEvento" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                  <EventoAValidar />
                </ProtectedRoutePorRol>
                } /> 

          <Route path="/modificar-eliminar-noticias" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                  <ModificarEliminarNoticias />
                </ProtectedRoutePorRol>
                } />     

          <Route path="/modificar-eliminar-artistas" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                  <ModificarEliminarArtistas />
                </ProtectedRoutePorRol>
                } />    

          <Route path="/editar-artista/:id" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                  <EditarArtista />
                </ProtectedRoutePorRol>
                } />     

          <Route path="/editar-noticia/:id" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                  <EditarNoticia />
                </ProtectedRoutePorRol>
                } />     

          <Route path="/crear-noticia" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                  <CrearNoticia />
                </ProtectedRoutePorRol>
                } />          

          <Route path="/crear-artista" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                   <CrearArtista />
                </ProtectedRoutePorRol>
                } />
          <Route path="/editar-carrusel" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                   <EditarCarousel />
                </ProtectedRoutePorRol>
                } />

          <Route path="/actualizar-tyc" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                   <ActualizarTyC />
                </ProtectedRoutePorRol>
                } />
                
          <Route path="/ver-reporte-de-ventas" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                   <VerReporteDeVentas />
                </ProtectedRoutePorRol>
                } />
                
          <Route path="/reporte-ventas/:id" element={
                <ProtectedRoutePorRol rolesPermitidos={[1]}>
                   <ReporteVentasEvento />
                </ProtectedRoutePorRol>
                } />
          
        </Routes>
      </Router>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;