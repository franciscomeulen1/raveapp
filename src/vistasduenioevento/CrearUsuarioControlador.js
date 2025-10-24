// src/vistas/CrearUsuarioControlador.js
import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faUserShield } from '@fortawesome/free-solid-svg-icons';

function CrearUsuarioControlador() {
  const { user } = useContext(AuthContext); // Necesitamos user.id (idUsuarioOrg)
  const idUsuarioOrg = user?.id; // <- ajustá esto si tu contexto usa otra key

  // --- State del formulario ---
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');

  // --- State del fetch/lista ---
  const [usuariosControl, setUsuariosControl] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);

  // --- UI feedback ---
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [okMsg, setOkMsg] = useState('');

  // ---------------------------
  // Cargar lista inicial
  // ---------------------------
  useEffect(() => {
    const fetchUsuariosControl = async () => {
      if (!idUsuarioOrg) return; // si aún no está cargado el contexto
      try {
        setLoadingLista(true);
        setErrMsg('');
        const resp = await api.get(
          `/Usuario/GetUsuariosControl`,
          {
            params: {
              idUsuarioOrg: idUsuarioOrg,
            },
          }
        );
        // resp.data debería ser el array:
        // [{ idUsuarioControl, nombreUsuario }, ...]
        setUsuariosControl(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error('Error al obtener usuarios controladores', err);
        setErrMsg('No se pudieron cargar los usuarios controladores.');
      } finally {
        setLoadingLista(false);
      }
    };

    fetchUsuariosControl();
  }, [idUsuarioOrg]);

  // ---------------------------
  // Crear usuario controlador
  // ---------------------------
  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nombreUsuario.trim() || !password.trim()) {
        setErrMsg('Por favor completa el usuario y la contraseña.');
        setOkMsg('');
        return;
    }

    if (!idUsuarioOrg) {
        setErrMsg('No se pudo identificar al organizador logueado.');
        setOkMsg('');
        return;
    }

    try {
      setSubmitting(true);
      setErrMsg('');
      setOkMsg('');

      const body = {
        idUsuarioOrg: idUsuarioOrg,
        nombreUsuario: nombreUsuario.trim(),
        password: password.trim(),
      };

      const resp = await api.post('/Usuario/CreateUsuarioControl', body);

      // resp.data debería contener el nuevo usuario creado:
      // { idUsuarioControl, idUsuarioOrg, nombreUsuario }
      const nuevo = resp.data;

      // Actualizo lista en memoria sin volver a pedir todo
      setUsuariosControl((prev) => [
        ...prev,
        { idUsuarioControl: nuevo.idUsuarioControl, nombreUsuario: nuevo.nombreUsuario },
      ]);

      // limpio form
      setNombreUsuario('');
      setPassword('');

      setOkMsg(`Usuario controlador "${nuevo.nombreUsuario}" creado correctamente.`);
    } catch (err) {
      console.error('Error al crear usuario controlador', err);
      setErrMsg('No se pudo crear el usuario controlador. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------
  // Eliminar usuario controlador
  // ---------------------------
  const handleEliminar = async (idUsuarioControl) => {
    if (!window.confirm('¿Seguro que querés eliminar este usuario controlador? Esta acción no se puede deshacer.')) {
      return;
    }

    if (!idUsuarioOrg) {
      setErrMsg('No se pudo identificar al organizador logueado.');
      setOkMsg('');
      return;
    }

    try {
      setErrMsg('');
      setOkMsg('');

      const body = {
        idUsuarioOrg: idUsuarioOrg,
        idUsuarioControl: idUsuarioControl,
      };

      await api.delete('/Usuario/DeleteUsuarioControl', {
        data: body,
      });

      // saco de la lista local
      setUsuariosControl((prev) =>
        prev.filter((u) => u.idUsuarioControl !== idUsuarioControl)
      );

      setOkMsg('Usuario controlador eliminado.');
    } catch (err) {
      console.error('Error al eliminar usuario controlador', err);
      setErrMsg('No se pudo eliminar el usuario controlador.');
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      {/* NAV */}
      <div className="flex-1">
        <div className="sm:px-10">
          <NavBar />
        </div>

        <main className="px-4 py-6 sm:px-10 sm:py-10 max-w-5xl mx-auto w-full">
          {/* Título + descripción */}
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserShield} className="text-indigo-300" />
                  Usuarios controladores
                </h1>
                <p className="text-sm text-indigo-200/80 max-w-lg mt-1">
                  Creá credenciales para el personal que controla entradas en la puerta.
                  Podés generar tantos usuarios como necesites para tu equipo.
                </p>
              </div>
            </div>
          </header>

          {/* Mensajes globales */}
          {(errMsg || okMsg) && (
            <div className="mb-6">
              {errMsg && (
                <div className="bg-red-600/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm font-medium">
                  {errMsg}
                </div>
              )}
              {okMsg && (
                <div className="bg-emerald-600/20 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl text-sm font-medium">
                  {okMsg}
                </div>
              )}
            </div>
          )}

          {/* Grid responsive: izquierda formulario / derecha lista */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card: Crear nuevo usuario controlador */}
            <div className="bg-slate-800/60 backdrop-blur rounded-2xl shadow-xl border border-white/10 p-6 flex flex-col">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faPlus} className="text-indigo-300" />
                Crear nuevo usuario controlador
              </h2>

              <form onSubmit={handleCrear} className="flex flex-col gap-5">
                {/* Campo nombreUsuario */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-indigo-200 mb-1">
                    Nombre de usuario (login)
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-slate-900/60 text-white placeholder-slate-400 border-slate-600 focus:border-indigo-400 focus:outline-none rounded-xl"
                    placeholder="Ej: PuertaSala1"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    disabled={submitting}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Este es el usuario que van a escribir en la app de control de entrada.
                  </p>
                </div>

                {/* Campo password */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-indigo-200 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-slate-900/60 text-white placeholder-slate-400 border-slate-600 focus:border-indigo-400 focus:outline-none rounded-xl"
                    placeholder="Ej: fiesta2025!"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Guardala. No se puede recuperar más tarde.
                  </p>
                </div>

                {/* Botón crear */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn w-full sm:w-auto rounded-xl shadow-lg font-semibold border-0 text-white
                    ${submitting
                      ? 'bg-indigo-600/40 cursor-not-allowed'
                      : 'bg-indigo-500 hover:bg-indigo-400'
                    }`}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  {submitting ? 'Creando...' : 'Crear usuario controlador'}
                </button>
              </form>

              {/* Nota de seguridad */}
              <div className="mt-6 text-[11px] leading-relaxed text-slate-400 bg-slate-900/40 rounded-lg p-3 border border-white/5">
                Recordá: si alguien olvida la contraseña, tenés que
                <span className="text-white font-medium"> eliminar ese usuario </span>
                y crear uno nuevo. No existe recuperación de contraseña.
              </div>
            </div>

            {/* Card: Lista de usuarios existentes */}
            <div className="bg-slate-800/60 backdrop-blur rounded-2xl shadow-xl border border-white/10 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Tus usuarios controladores
                </h2>
                <div className="text-[11px] text-slate-400">
                  {loadingLista
                    ? 'Cargando...'
                    : `${usuariosControl.length} usuario${usuariosControl.length === 1 ? '' : 's'}`}
                </div>
              </div>

              {/* Tabla / lista responsive */}
              <div className="flex-1 overflow-x-auto">
                {loadingLista ? (
                  <div className="text-slate-400 text-sm">Cargando lista...</div>
                ) : usuariosControl.length === 0 ? (
                  <div className="text-slate-400 text-sm italic">
                    Todavía no creaste usuarios controladores.
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-700/60">
                    {usuariosControl.map((u) => (
                      <li
                        key={u.idUsuarioControl}
                        className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
                      >
                        {/* Nombre + id corto en mobile */}
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium break-all">
                            {u.nombreUsuario}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3 sm:mt-0">
                          <button
                            className="btn btn-sm rounded-lg bg-red-600 hover:bg-red-500 border-0 text-white font-semibold shadow-md"
                            onClick={() => handleEliminar(u.idUsuarioControl)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                Si alguien se queda sin acceso, simplemente <span className="text-white">eliminalo</span> y creá otro usuario nuevo con otra contraseña.
              </p>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default CrearUsuarioControlador;
