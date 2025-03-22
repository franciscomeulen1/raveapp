// Filtros.js
import React, { useState } from 'react';
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
    direccion: '',
  });

  // Callback para recibir los datos de ubicación desde el componente InputUbicacionEvento
  const handleUbicacionChange = (data) => {
    setUbicacion(data);
  };

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
      direccion: '',
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
              <span className="label-text">After</span>
              <input
                type="checkbox"
                checked={after}
                onChange={(e) => setAfter(e.target.checked)}
                className="checkbox checkbox-primary"
              />
            </label>
            <label className="cursor-pointer label justify-start">
              <span className="label-text">LGBT</span>
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


// function Filtros() {
//     return (
//         <div>
//             {/* <label htmlFor="my-modal-3" className="btn modal-button btn-ghost shadow rounded-box w-auto hover:bg-indigo-400 hover:text-cyan-200 ml-3">Filtros</label>  */}

//             <input type="checkbox" id="my-modal-filtros" className="modal-toggle" />
//             <label htmlFor="my-modal-filtros" className="modal modal-middle">

//                 <form className="modal-box">

//                     <h2 className="font-bold text-3xl mt-3 mb-2">Filtrar búsqueda</h2>

//                     <div className="form-control w-full max-w-xs">
//                         <label className="label">
//                             <span className="label-text">Género</span>
//                         </label>
//                         <select defaultValue="Todos" className="select select-bordered">
//                             <option>Todos</option>
//                             <option>Techno</option>
//                             <option>Tech-House</option>
//                             <option>House</option>
//                             <option>Progressive</option>
//                             <option>Trance</option>
//                             <option>Psy-Trance</option>
//                         </select>
//                     </div>

//                     <div className="form-control w-full max-w-xs">
//                         <label className="label">
//                             <span className="label-text">Ubicación:</span>
//                         </label>
//                         <select defaultValue="Todas" className="select select-bordered">
//                             <option>Todas</option>
//                             <option>Capital Federal</option>
//                             <option>Gran Bs.As. Norte</option>
//                             <option>Gran Bs.As. Oeste</option>
//                             <option>Gran Bs.As. Sur</option>
//                             <option>Bs.As. Interior</option>
//                             <option>Catamarca</option>
//                             <option>Chaco</option>
//                             <option>Córdoba</option>
//                             <option>Corrientes</option>
//                             <option>Entre Ríos</option>
//                             <option>Formosa</option>
//                             <option>Jujuy</option>
//                             <option>La Pampa</option>
//                             <option>La Rioja</option>
//                             <option>Mendoza</option>
//                             <option>Misiones</option>
//                             <option>Neuquén</option>
//                             <option>Río Negro</option>
//                             <option>Salta</option>
//                             <option>San Juan</option>
//                             <option>San Luis</option>
//                             <option>Santa Cruz</option>
//                             <option>Santa Fe</option>
//                             <option>Santiago del Estero</option>
//                             <option>Tierra del Fuego</option>
//                             <option>Tucumán</option>
//                         </select>
//                     </div>

//                     <div className="form-control">
//                         <label className="label cursor-pointer justify-start">
//                             <span className="label-text mr-2">LGBT: </span>
//                             <input type="checkbox" className="checkbox checkbox-primary" />
//                         </label>
//                     </div>

//                     <div className="form-control">
//                         <label className="label cursor-pointer justify-start">
//                             <span className="label-text mr-2">After: </span>
//                             <input type="checkbox" className="checkbox checkbox-primary" />
//                         </label>
//                     </div>

//                     <div className="form-control w-full">
//                         <label className="label">
//                             <span className="label-text">Alguna fecha en específico?</span>
//                         </label>
//                         <div className='inline-flex'>
//                             <select className="select select-bordered">
//                                 <option>1</option>
//                                 <option>2</option>
//                                 <option>3</option>
//                                 <option>4</option>
//                                 <option>5</option>
//                                 <option>6</option>
//                                 <option>7</option>
//                                 <option>8</option>
//                                 <option>9</option>
//                                 <option>10</option>
//                                 <option>11</option>
//                                 <option>12</option>
//                                 <option>13</option>
//                                 <option>14</option>
//                                 <option>15</option>
//                                 <option>16</option>
//                                 <option>17</option>
//                                 <option>18</option>
//                                 <option>19</option>
//                                 <option>20</option>
//                                 <option>21</option>
//                                 <option>22</option>
//                                 <option>23</option>
//                                 <option>24</option>
//                                 <option>25</option>
//                                 <option>26</option>
//                                 <option>27</option>
//                                 <option>28</option>
//                                 <option>29</option>
//                                 <option>30</option>
//                                 <option>31</option>
//                             </select>
//                             <select className="select select-bordered">
//                                 <option>Enero</option>
//                                 <option>Febrero</option>
//                                 <option>Marzo</option>
//                                 <option>Abril</option>
//                                 <option>Mayo</option>
//                                 <option>Junio</option>
//                                 <option>Julio</option>
//                                 <option>Agosto</option>
//                                 <option>Septiembre</option>
//                                 <option>Octubre</option>
//                                 <option>Noviembre</option>
//                                 <option>Diciembre</option>
//                             </select>
//                             <select className="select select-bordered">
//                                 <option>2022</option>
//                                 <option>2023</option>
//                                 <option>2024</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div className="modal-action justify-start">
//                         <button type="submit" htmlFor="my-modal-2" className="btn">Buscar</button>
//                     </div>

//                 </form>
//             </label>

//         </div>

//     );
// }

// export default Filtros;