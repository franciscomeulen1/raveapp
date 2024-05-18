import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import InputDeArtistas from '../components/InputDeArtistas';
import InputFechaHora from '../components/InputFechaHora';
import InputUbicacionEvento from '../components/InputUbicacionEvento';

function CrearEvento() {

  // Esto se ejecuta solo una vez cuando se monta el componente
  useEffect(() => {
    window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página
  }, []); // La matriz de dependencias vacía asegura que este efecto solo se ejecute una vez

  const [inicioDateTime, setInicioDateTime] = useState('');
  const [finDateTime, setFinDateTime] = useState('');

  const handleInicioDateTimeChange = (event) => {
    setInicioDateTime(event.target.value);
  };

  const handleFinDateTimeChange = (event) => {
    setFinDateTime(event.target.value);
  };

  return (
    <div>
      <div className="sm:px-10 mb-11">
        <NavBar />

        <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Crear evento</h1>

        <form className='px-10'>

          <div className='grid sm:grid-cols-2 gap-10 mb-6'>
            <div className='columns-1'>
              <h2 className='text-xl font-bold'>Datos personales:</h2>
              <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text font-semibold text-lg">Tu nombre:</span>
                </label>
                <input type='text'
                  placeholder="Escribe tu nombre"
                  className="input input-bordered w-full max-w-xs"
                  autoFocus
                />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text  font-semibold text-lg">Tu apellido:</span>
                </label>
                <input type='text'
                  placeholder="Escribe tu apellido"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text  font-semibold text-lg">Tu telefono:</span>
                </label>
                <input type='text'
                  placeholder="Escribe tu telefono"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text font-semibold text-lg">Email:</span>
                </label>
                <input type='text'
                  placeholder="Escribe tu email"
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <p className='mt-4'>* Te crearemos una cuenta con tu nombre y correo para que puedas administrar tus eventos.<br /> Te enviaremos una constraseña al correo ingresado.</p>
            </div>
            <div className='columns-1'>
              <img src="https://www.dondeir.com/wp-content/uploads/2018/09/fiesta-1.jpg" width="550" height="auto" alt="imagen de evento" />
            </div>
          </div>

          {/* ----------------------------------------------------------------------------------- */}

          <h2 className='text-xl font-bold'>Datos del evento:</h2>



          {/* NOMBRE DEL EVENTO */}

          <div className='form-control w-full mb-4'>
            <label className="label">
              <span className="label-text font-semibold text-lg">Nombre del evento:</span>
            </label>
            <input type='text'
              placeholder="Nombre del evento"
              className="input input-bordered w-full max-w-lg"
              style={{ width: '100%' }} // Sobrescribe el ancho del input
            />
          </div>

          {/* GENERO MUSICAL */}

          <div className="form-control w-full max-w-xs grid grid-cols-2 mb-4">
            <label className="label">
              <span className="label-text font-semibold text-lg">Género musical:</span>
            </label>
            <div></div>
            <label className="label cursor-pointer justify-start">
              <span className="label-text mr-2">Techno</span>
              <input type="checkbox" value="techno" className="checkbox" />
            </label>

            <label className="label cursor-pointer justify-start">
              <span className="label-text mr-2">Tech-House</span>
              <input type="checkbox" value="techhouse" className="checkbox" />
            </label>

            <label className="label cursor-pointer justify-start">
              <span className="label-text mr-2">House</span>
              <input type="checkbox" value="house" className="checkbox" />
            </label>

            <label className="label cursor-pointer justify-start">
              <span className="label-text mr-2">Progressive</span>
              <input type="checkbox" value="progressive" className="checkbox" />
            </label>

            <label className="label cursor-pointer justify-start">
              <span className="label-text mr-2">Trance</span>
              <input type="checkbox" value="trance" className="checkbox" />
            </label>

            <label className="label cursor-pointer justify-start">
              <span className="label-text mr-2">Psy-Trance</span>
              <input type="checkbox" value="psytrance" className="checkbox" />
            </label>

          </div>

          <div className='mb-5'>
            <InputDeArtistas />
          </div>

          <h3 className='text-xl font-bold'>Ubicación del evento:</h3>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-6'>

            <div className='columns-1'>

            <InputUbicacionEvento />

              {/* <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text font-semibold text-lg">Provincia:</span>
                </label>
                <select defaultValue="Seleccione una provincia" className="select select-bordered">
                  <option disabled>Seleccione una provincia</option>
                  <option>Buenos Aires</option>
                  <option>Catamarca</option>
                  <option>Chaco</option>
                  <option>Córdoba</option>
                  <option>Corrientes</option>
                  <option>Entre Ríos</option>
                  <option>Formosa</option>
                  <option>Jujuy</option>
                  <option>La Pampa</option>
                  <option>La Rioja</option>
                  <option>Mendoza</option>
                  <option>Misiones</option>
                  <option>Neuquén</option>
                  <option>Río Negro</option>
                  <option>Salta</option>
                  <option>San Juan</option>
                  <option>San Luis</option>
                  <option>Santa Cruz</option>
                  <option>Santa Fe</option>
                  <option>Santiago del Estero</option>
                  <option>Tierra del Fuego</option>
                  <option>Tucumán</option>
                </select>
              </div> */}

              {/* <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text font-semibold text-lg">Partido:</span>
                </label>
                <select defaultValue="Seleccione un partido" className="select select-bordered">
                  <option disabled>Seleccione un partido</option>
                  <option>Partido 1</option>
                  <option>Partido 2</option>
                </select>
              </div> */}

              {/* <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text font-semibold text-lg">Localidad:</span>
                </label>
                <select defaultValue="Seleccione una localidad" className="select select-bordered">
                  <option disabled>Seleccione una localidad</option>
                  <option>Localidad 1</option>
                  <option>Localidad 2</option>
                </select>
              </div> */}

              {/* <div className='form-control w-full max-w-xs'>
                <label className="label">
                  <span className="label-text font-semibold text-lg">Dirección:</span>
                </label>
                <input type='text'
                  placeholder="Dirección del evento"
                  className="input input-bordered w-full"
                />
              </div> */}

              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <span className="label-text mr-2 font-semibold text-lg">Es After?</span>
                  <input type="checkbox" className="checkbox checkbox-primary" />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <span className="label-text mr-2 font-semibold text-lg">Es un evento LGBT?</span>
                  <input type="checkbox" className="checkbox checkbox-primary" />
                </label>
              </div>

              <div className="form-control w-full max-w-md">
                <label className="label">
                  <span className="label-text font-semibold text-lg">Descripción del evento:</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" placeholder="Descripcion..."></textarea>
              </div>

              {/* FECHA Y HORA - INICIO Y FIN  */}

              <div>
                {/* <h3 className='text-xl font-bold'>Fecha y hora del evento:</h3> */}

                <div>
                  <InputFechaHora
                    label='Fecha y hora de inicio:'
                    value={inicioDateTime}
                    onChange={handleInicioDateTimeChange}
                  />
                  </div>
                  <div>
                  <InputFechaHora
                    label='Fecha y hora de fin:'
                    value={finDateTime}
                    onChange={handleFinDateTimeChange}
                  />
                </div>
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text font-semibold text-lg">Agregar video:</span>
                </label>
                <input type="text" placeholder="Pegá el link de YouTube aquí" className="input input-bordered w-full max-w-xs" />
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text font-semibold text-lg">Agregar música:</span>
                </label>
                <input type="text" placeholder="Pegá el link de Spotify o SoundCloud aquí" className="input input-bordered w-full max-w-xs" />
              </div>

              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text font-semibold text-lg">Foto del evento:</span>
                </label>
                <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
              </div>
            </div>

          </div>

          <div className="form-control mb-4">
            <label className="cursor-pointer label justify-start">
              <input type="checkbox" className="checkbox checkbox-accent mr-2" />
              <span className="label-text">Acepto terminos y condiciones</span>
            </label>
          </div>

          <button type="button" className="btn btn-secondary rounded-xl">Crear Evento</button>

        </form>


      </div>

      <Footer />
    </div>
  )
}

export default CrearEvento