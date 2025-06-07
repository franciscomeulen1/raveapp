import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas';
import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento';
import InputFechaHoraEvento from '../components/componentsCrearEvento/InputFechaHoraEvento';
import InputEntradasCantPrecio from '../components/componentsCrearEvento/InputEntradasCantPrecio';
import InputMultimedia from '../components/componentsCrearEvento/InputMultimedia';
import InputConfigEntradas from '../components/componentsCrearEvento/InputConfigEntradas';
import InputGeneroMusical from '../components/componentsCrearEvento/InputGeneroMusical';
import InputCantDiasEvento from '../components/componentsCrearEvento/InputCantDiasEvento';
import InputEsEventoRecurrente from '../components/componentsCrearEvento/InputEsEventoRecurrente';
import InputDescripcionEvento from '../components/componentsCrearEvento/InputDescripcionEvento';
import InputAfterOLbgt from '../components/componentsCrearEvento/InputAfterOLgbt';
import api from '../componenteapi/api';

function CrearEvento() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [diasEvento, setDiasEvento] = useState(1);
  // Para fecha y hora de inicio y fin del evento.
  // eslint-disable-next-line no-unused-vars
  const [fechaHoraEvento, setFechaHoraEvento] = useState({ inicio: '', fin: '' });
  // eslint-disable-next-line no-unused-vars
  const [artistasSeleccionados, setArtistasSeleccionados] = useState([]);

  const handleFechaHoraEventoChange = (nuevasFechas) => {
    setFechaHoraEvento(nuevasFechas);
  };

  const handleCrearEvento = async () => {
    try {
      // 1. Separar artistas nuevos y existentes
      const artistasNuevos = artistasSeleccionados.filter(a => a.esNuevo);
      const artistasExistentes = artistasSeleccionados.filter(a => !a.esNuevo);

      // 2. Crear artistas nuevos y recolectar sus IDs
      const idsNuevos = [];
      for (const nuevo of artistasNuevos) {
        const response = await api.post('/Artista/CreateArtista', {
          nombre: nuevo.nombre,
          bio: '',
          socials: {
            idSocial: '',
            mdInstagram: '',
            mdSpotify: '',
            mdSoundcloud: ''
          },
          isActivo: false
        });
        idsNuevos.push(response.data.idArtista); // Asegúrate que devuelva el ID
      }

      // 3. Obtener todos los IDs
      const idsArtistas = [
        ...artistasExistentes.map(a => a.id),
        ...idsNuevos
      ];

      // 4. Crear el evento
      const nuevoEvento = {
        // otros campos del formulario
        artistas: idsArtistas,
      };

      await api.post('/Evento/CrearEvento', nuevoEvento);
      alert('Evento creado correctamente');
    } catch (error) {
      console.error('Error al crear evento:', error);
    }
  };

  return (
    <div>
      <div className="sm:px-10 mb-11">
        <NavBar />
        <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Crear Evento</h1>

        <form className='px-10'>
          <h2 className='text-xl font-bold'>Datos del evento:</h2>
          <div className='form-control w-full mb-4'>
            <label className="label">
              <span className="label-text font-semibold text-lg">Nombre del evento:</span>
            </label>
            <input type='text' placeholder="Nombre del evento" className="input input-bordered w-full max-w-lg" />
          </div>

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputEsEventoRecurrente />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputCantDiasEvento onDiasChange={setDiasEvento} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputGeneroMusical />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <div className='mb-5'><InputDeArtistas onSeleccionarArtistas={setArtistasSeleccionados} /></div>

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <h3 className='text-xl font-bold'>Ubicación del evento:</h3>
          <div className='mb-6'><InputUbicacionEvento /></div>

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputAfterOLbgt />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputDescripcionEvento />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          {/* <InputFechaHoraEvento onFechaHoraChange={handleFechaHoraEventoChange} /> */}
          <InputFechaHoraEvento diasEvento={diasEvento} onFechaHoraChange={handleFechaHoraEventoChange} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputEntradasCantPrecio diasEvento={diasEvento} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputConfigEntradas diasEvento={diasEvento} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputMultimedia />

          <div className='form-control mb-4'>
            <label className='cursor-pointer label justify-start'>
              <input type='checkbox' className='checkbox checkbox-accent mr-2' />
              <span className='label-text'>Acepto términos y condiciones</span>
            </label>
          </div>

          <button type='button' onClick={handleCrearEvento} className='btn btn-primary bg-purple-600 text-white rounded-xl'>Crear Evento</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default CrearEvento;