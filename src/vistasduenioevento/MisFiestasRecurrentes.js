import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

export default function MisFiestasRecurrentes() {
  const { user: loggedUser } = useContext(AuthContext);
  const idUsuario = loggedUser.id;

  const [fiestas, setFiestas] = useState([]);
  const [newFiestaName, setNewFiestaName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [fiestaAEliminar, setFiestaAEliminar] = useState(null);

  // capitaliza sin romper espacios
  const toTitleCase = (str) => {
    return str.replace(/\b\w+/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  };

  const fetchFiestas = useCallback(async () => {
    try {
      const response = await api.get(`/Fiesta/GetFiestas?IdUsuario=${idUsuario}`);
      const fiestasActivas = (response.data.fiestas || [])
        .filter(f => f.isActivo)
        .sort((a, b) => a.dsNombre.localeCompare(b.dsNombre));
      setFiestas(fiestasActivas);
    } catch (error) {
      console.error('Error al obtener las fiestas:', error);
    }
  }, [idUsuario]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFiestas();
  }, [fetchFiestas]);

  const handleAddFiesta = async (e) => {
    e.preventDefault();
    const fiestaName = newFiestaName.trim();
    if (!fiestaName) return;

    const existe = fiestas.some(f => f.dsNombre.toLowerCase() === fiestaName.toLowerCase());
    if (existe) {
      alert('La fiesta ya se encuentra en la lista.');
      return;
    }

    try {
      await api.post('/Fiesta/CrearFiesta', {
        nombre: fiestaName,
        idUsuario
      });
      setNewFiestaName('');
      fetchFiestas();
    } catch (error) {
      console.error('Error al crear la fiesta:', error);
    }
  };

  const handleEditSave = async () => {
    if (!editingValue.trim()) return;

    const fiesta = fiestas[editingIndex];
    try {
      await api.put('/Fiesta/UpdateFiesta', {
        nombre: editingValue.trim(),
        idFiesta: fiesta.idFiesta
      });
      setEditingIndex(null);
      setEditingValue('');
      fetchFiestas();
    } catch (error) {
      console.error('Error al actualizar la fiesta:', error);
    }
  };

  const handleDelete = (index) => {
    setFiestaAEliminar(fiestas[index]);
    setShowModal(true);
  };

  const confirmarEliminacion = async () => {
    try {
      await api.delete(`/Fiesta/DeleteFiesta?id=${fiestaAEliminar.idFiesta}`);
      setShowModal(false);
      setFiestaAEliminar(null);
      fetchFiestas();
    } catch (error) {
      console.error('Error al eliminar la fiesta:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-grow sm:px-10 mb-11">
        <NavBar />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 mt-4">
          <div className="md:col-span-2">
            <h1 className="mb-6 mt-2 text-3xl font-bold underline underline-offset-8">
              Mis Fiestas Recurrentes:
            </h1>

            <div className="space-y-3 text-sm sm:text-base">
              <p className="mb-4">
               Las fiestas recurrentes, como su nombre indica, son aquellas que organizas de manera regular.
               Pueden ser semanales, mensuales o con la frecuencia que tú elijas.
             </p>
             <p className="mb-4">
               Si una fiesta se va a hacer una sola vez, o si es una fiesta única que se hace porque viene
               determinado DJ a la Argentina, NO es una fiesta recurrente.
             </p>
             <p className="mb-4">
               En esta sección podrás agregar, editar o eliminar los nombres de las fiestas que realices
               de manera continua para mantener un registro actualizado.
             </p>
             <p className="mb-4">
               Además, las fiestas recurrentes podrán ser calificadas por aquellos usuarios que hayan
               adquirido una entrada para dicho evento. Van a poder puntuar la fiesta e incluso dejar un
               comentario si así lo desean.
             </p>
            </div>

            <hr className="mt-7 mb-4" />

            <h2 className="mb-3 text-xl font-bold underline underline-offset-8">Agregar fiesta recurrente:</h2>
            <form
              onSubmit={handleAddFiesta}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
            >
              <input
                type="text"
                className="input input-bordered w-full sm:max-w-xs"
                placeholder="Nombre de la fiesta"
                value={newFiestaName}
                onChange={(e) => setNewFiestaName(toTitleCase(e.target.value))}
              />
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                Confirmar
              </button>
            </form>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Listado de mis fiestas recurrentes:</h2>

              {/* ✅ Cards responsive en lugar de tabla */}
              <div className="space-y-3">
                {fiestas.length === 0 && (
                  <p className="text-gray-500">Todavía no cargaste fiestas recurrentes.</p>
                )}

                {fiestas.map((fiesta, index) => (
                  <div
                    key={fiesta.idFiesta}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm"
                  >
                    {/* izquierda: nombre o input */}
                    <div className="flex-1">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          className="input input-bordered w-full md:max-w-sm"
                          value={editingValue}
                          onChange={(e) => setEditingValue(toTitleCase(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave();
                          }}
                        />
                      ) : (
                        <p className="text-base font-medium">{fiesta.dsNombre}</p>
                      )}
                    </div>

                    {/* centro: ver calificaciones */}
                    <div className="flex gap-2 items-center">
                      <Link
                        to={`/resenias-de-la-fiesta/${fiesta.idFiesta}`}
                        state={{ nombreFiesta: fiesta.dsNombre }}
                        className="link link-primary text-sm"
                      >
                        Ver calificaciones
                      </Link>
                    </div>

                    {/* derecha: acciones */}
                    <div className="flex gap-2 flex-wrap">
                      {editingIndex === index ? (
                        <>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={handleEditSave}
                          >
                            Guardar
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={handleEditCancel}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setEditingIndex(index);
                            setEditingValue(toTitleCase(fiesta.dsNombre));
                          }}
                        >
                          Editar
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(index)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha vacía en desktop */}
          <div className="hidden md:block" />
        </div>
      </div>
      <Footer />

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">¿Eliminar fiesta?</h3>
            <p className="mb-6">
              ¿Estás seguro de que querés eliminar <strong>{fiestaAEliminar?.dsNombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowModal(false);
                  setFiestaAEliminar(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-error"
                onClick={confirmarEliminacion}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}