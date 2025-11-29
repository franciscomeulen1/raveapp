// src/vistas/CrearUsuarioControlador.js
import React, { useContext, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faUserShield,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

function CrearUsuarioControlador() {
  const { user } = useContext(AuthContext); // Necesitamos user.id (idUsuarioOrg)
  const idUsuarioOrg = user?.id; // <- ajustá esto si tu contexto usa otra key

  // --- State del formulario ---
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- State del fetch/lista ---
  const [usuariosControl, setUsuariosControl] = useState([]);
  const [loadingLista, setLoadingLista] = useState(false);

  // --- UI feedback global ---
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [okMsg, setOkMsg] = useState('');

  // --- Modal eliminar ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Cargar lista inicial
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchUsuariosControl = async () => {
      if (!idUsuarioOrg) return; // si aún no está cargado el contexto
      try {
        setLoadingLista(true);
        setErrMsg('');
        const resp = await api.get('/Usuario/GetUsuariosControl', {
          params: {
            idUsuarioOrg: idUsuarioOrg,
          },
        });

        setUsuariosControl(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error('Error al obtener usuarios controladores', err);

        // Si la respuesta del backend tiene código 404, no mostramos mensaje de error
        if (err.response && err.response.status === 404) {
          setUsuariosControl([]); // aseguramos lista vacía
          return;
        }

        // Para cualquier otro error, mostramos mensaje
        setErrMsg('No se pudieron cargar los usuarios controladores.');
      } finally {
        setLoadingLista(false);
      }
    };

    fetchUsuariosControl();
  }, [idUsuarioOrg]);

  // Crear usuario controlador
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

      const nuevo = resp.data;

      setUsuariosControl((prev) => [
        ...prev,
        {
          idUsuarioControl: nuevo.idUsuarioControl,
          nombreUsuario: nuevo.nombreUsuario,
        },
      ]);

      setNombreUsuario('');
      setPassword('');
      setShowPassword(false);

      setOkMsg(
        `Usuario controlador "${nuevo.nombreUsuario}" creado correctamente.`
      );
    } catch (err) {
      console.error('Error al crear usuario controlador', err);
      setErrMsg('No se pudo crear el usuario controlador. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmar eliminación (se llama desde el modal)
  const confirmarEliminarUsuarioControlador = async () => {
    if (!usuarioAEliminar) return;

    if (!idUsuarioOrg) {
      setErrMsg('No se pudo identificar al organizador logueado.');
      setOkMsg('');
      return;
    }

    try {
      setDeleting(true);
      setErrMsg('');
      setOkMsg('');

      const body = {
        idUsuarioOrg: idUsuarioOrg,
        idUsuarioControl: usuarioAEliminar.idUsuarioControl,
      };

      await api.delete('/Usuario/DeleteUsuarioControl', {
        data: body,
      });

      setUsuariosControl((prev) =>
        prev.filter(
          (u) => u.idUsuarioControl !== usuarioAEliminar.idUsuarioControl
        )
      );

      setOkMsg('Usuario controlador eliminado.');
    } catch (err) {
      console.error('Error al eliminar usuario controlador', err);
      setErrMsg('No se pudo eliminar el usuario controlador.');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setUsuarioAEliminar(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* NAV */}
      <div className="flex-1">
        <div className="sm:px-10 bg-white">
          <NavBar />
        </div>

        <main className="px-4 py-6 sm:px-10 sm:py-10 max-w-5xl mx-auto w-full bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
          {/* Título + descripción */}
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 px-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-slate-900">
                  <FontAwesomeIcon
                    icon={faUserShield}
                    className="text-indigo-500"
                  />
                  Usuarios controladores
                </h1>
                <p className="text-sm text-slate-500 max-w-lg mt-1">
                  Creá credenciales para el personal que controla entradas en la
                  puerta. Podés generar tantos usuarios como necesites para tu
                  equipo.
                </p>
              </div>
            </div>
          </header>

          {/* Mensajes globales */}
          {(errMsg || okMsg) && (
            <div className="mb-6 space-y-3">
              {errMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {errMsg}
                </div>
              )}
              {okMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
                  {okMsg}
                </div>
              )}
            </div>
          )}

          {/* Grid responsive: izquierda form / derecha lista */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card crear usuario */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faPlus} className="text-indigo-500" />
                Crear nuevo usuario controlador
              </h2>

              <form onSubmit={handleCrear} className="flex flex-col gap-5">
                {/* Campo nombreUsuario */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">
                    Nombre de usuario (login)
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full bg-white text-slate-900 placeholder-slate-400 border-gray-300 focus:border-indigo-400 focus:outline-none rounded-xl"
                    placeholder="Ej: PuertaSala1"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    disabled={submitting}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Este es el usuario que van a escribir en la app de control
                    de entrada.
                  </p>
                </div>

                {/* Campo password con ojito */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-1">
                    Contraseña
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input input-bordered w-full bg-white text-slate-900 placeholder-slate-400 border-gray-300 focus:border-indigo-400 focus:outline-none rounded-xl pr-10"
                      placeholder="Ej: fiesta2025!"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={submitting}
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                      }
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Guardala. No se puede recuperar más tarde.
                  </p>
                </div>

                {/* Botón crear */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn w-full sm:w-auto rounded-xl shadow-md font-semibold border-0 text-white
                    ${
                      submitting
                        ? 'bg-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-500 hover:bg-indigo-400'
                    }`}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  {submitting ? 'Creando...' : 'Crear usuario controlador'}
                </button>
              </form>

              {/* Nota de seguridad */}
              <div className="mt-6 text-[11px] leading-relaxed text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-100">
                Recordá: si alguien olvida la contraseña, tenés que
                <span className="text-slate-900 font-medium">
                  {' '}
                  eliminar ese usuario{' '}
                </span>
                y crear uno nuevo. No existe recuperación de contraseña.
              </div>
            </div>

            {/* Card lista usuarios */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  Tus usuarios controladores
                </h2>
                <div className="text-[11px] text-slate-500">
                  {loadingLista
                    ? 'Cargando...'
                    : `${usuariosControl.length} usuario${
                        usuariosControl.length === 1 ? '' : 's'
                      }`}
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                {loadingLista ? (
                  <div className="text-slate-500 text-sm">Cargando lista...</div>
                ) : usuariosControl.length === 0 ? (
                  <div className="text-slate-500 text-sm italic">
                    Todavía no creaste usuarios controladores.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {usuariosControl.map((u) => (
                      <li
                        key={u.idUsuarioControl}
                        className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-slate-900 font-medium break-all">
                            {u.nombreUsuario}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3 sm:mt-0">
                          <button
                            className="btn btn-sm rounded-lg bg-red-500 hover:bg-red-400 border-0 text-white font-semibold shadow-sm"
                            onClick={() => {
                              setUsuarioAEliminar({
                                idUsuarioControl: u.idUsuarioControl,
                                nombreUsuario: u.nombreUsuario,
                              });
                              setShowDeleteModal(true);
                            }}
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
                Si alguien se queda sin acceso, simplemente{' '}
                <span className="text-slate-900">eliminalo</span> y creá otro
                usuario nuevo con otra contraseña.
              </p>
            </div>
          </section>

          {/* MODAL ELIMINAR */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Fondo oscuro */}
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => {
                  if (!deleting) {
                    setShowDeleteModal(false);
                    setUsuarioAEliminar(null);
                  }
                }}
              ></div>

              {/* Caja modal */}
              <div className="relative bg-white text-slate-900 rounded-2xl shadow-2xl border border-gray-200 w-[90%] max-w-sm p-6 z-10">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Eliminar usuario controlador
                </h3>

                <p className="text-sm text-slate-600 mb-4">
                  ¿Seguro que querés eliminar{' '}
                  <span className="text-slate-900 font-semibold">
                    {usuarioAEliminar?.nombreUsuario}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    className="btn rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 font-semibold flex-1 sm:flex-none"
                    disabled={deleting}
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUsuarioAEliminar(null);
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    className={`btn rounded-xl border-0 text-white font-semibold flex-1 sm:flex-none ${
                      deleting
                        ? 'bg-red-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-400'
                    }`}
                    disabled={deleting}
                    onClick={confirmarEliminarUsuarioControlador}
                  >
                    {deleting ? 'Eliminando...' : 'Eliminar definitivamente'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default CrearUsuarioControlador;