// Filtros.js
import React, { useState, useCallback } from 'react';
import FiltroUbicacion from './FiltroUbicacion';

const Filtros = ({ onFilter }) => {
  const [genero, setGenero] = useState('Todos');
  const [fechaOption, setFechaOption] = useState('todos'); // 'todos', 'especifica', 'estaSemana', 'proximoFinDeSemana'
  const [fechaEspecifica, setFechaEspecifica] = useState('');
  const [after, setAfter] = useState(false);
  const [lgbt, setLgbt] = useState(false);
  const [ubicacion, setUbicacion] = useState({
    provincia: '',
    municipio: '',
    localidad: '',
  });

  // Callback para recibir los datos de ubicación desde el componente FiltroUbicacion
  const handleUbicacionChange = useCallback((data) => {
    setUbicacion(data);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtros = {
      genero,
      fechaOption,
      fechaEspecifica,
      after,
      lgbt,
      ubicacion,
    };
    // Llamada al callback recibido para filtrar eventos en el componente padre
    onFilter(filtros);
    // Opcional: Cerrar el modal desactivando el checkbox (si no usas algún estado global para el modal)
    document.getElementById('my-modal-filtros').checked = false;
  };

  const handleReset = () => {
    setGenero('Todos');
    setFechaOption('todos');
    setFechaEspecifica('');
    setAfter(false);
    setLgbt(false);
    setUbicacion({
      provincia: '',
      municipio: '',
      localidad: '',
    });
    // También se puede notificar al padre para limpiar el filtrado
    onFilter({});
    document.getElementById('my-modal-filtros').checked = false;
  };

  return (
    <>
      <input type="checkbox" id="my-modal-filtros" className="modal-toggle" />
      <label htmlFor="my-modal-filtros" className="modal modal-middle cursor-pointer">
        {/* Evitamos que el clic en la modal cierre el formulario */}
        <form onSubmit={handleSubmit} className="modal-box relative" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold mb-4">Filtrar Búsqueda</h3>

          {/* Filtro por Género Musical */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Género Musical</span>
            </label>
            <select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              className="select select-bordered"
            >
              <option value="Todos">Todos</option>
              <option value="Techno">Techno</option>
              <option value="Tech-House">Tech-House</option>
              <option value="House">House</option>
              <option value="Progressive">Progressive</option>
              <option value="Trance">Trance</option>
              <option value="Minimal-Techno">Minimal-Techno</option>
              <option value="Hard-Techno">Hard-Techno</option>
              <option value="Acid-Techno">Acid-Techno</option>
              <option value="Industrial-Techno">Industrial-Techno</option>
              <option value="Dub-Techno">Dub-Techno</option>
              <option value="Melodic-Techno">Melodic-Techno</option>
              <option value="Tribal">Tribal</option>
            </select>
          </div>

          {/* Filtro por Ubicación (utilizando el componente con la API del gobierno) */}
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Ubicación del Evento</span>
            </label>
            <FiltroUbicacion onUbicacionChange={handleUbicacionChange} />
          </div>

          {/* Checkboxes para After y LGBT */}
          <div className="form-control mb-4">
            <label className="cursor-pointer label justify-start">
              <span className="label-text mr-2">After</span>
              <input
                type="checkbox"
                checked={after}
                onChange={(e) => setAfter(e.target.checked)}
                className="checkbox checkbox-primary"
              />
            </label>
            <label className="cursor-pointer label justify-start">
              <span className="label-text mr-2">LGBT</span>
              <input
                type="checkbox"
                checked={lgbt}
                onChange={(e) => setLgbt(e.target.checked)}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>

          {/* Filtro por Fecha */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Fecha del Evento</span>
            </label>
            <select
              value={fechaOption}
              onChange={(e) => setFechaOption(e.target.value)}
              className="select select-bordered mb-2"
            >
              <option value="todos">Todas las fechas</option>
              <option value="especifica">Fecha específica</option>
              <option value="estaSemana">Esta Semana</option>
              <option value="proximoFinDeSemana">Próximo Fin de Semana</option>
            </select>
            {fechaOption === 'especifica' && (
              <input
                type="date"
                value={fechaEspecifica}
                onChange={(e) => setFechaEspecifica(e.target.value)}
                className="input input-bordered"
              />
            )}
          </div>

          {/* Botones de acción */}
          <div className="modal-action">
            <button type="button" onClick={handleReset} className="btn btn-outline">
              Resetear Filtros
            </button>
            <button type="submit" className="btn btn-primary">
              Buscar
            </button>
          </div>
        </form>
      </label>
    </>
  );
};

export default Filtros;