import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas'; // ok
import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento'; // ok
import InputFechaHoraEvento from '../components/componentsCrearEvento/InputFechaHoraEvento'; // ok
import InputEntradasCantPrecio from '../components/componentsCrearEvento/InputEntradasCantPrecio'; // ok
import InputConfigEntradas from '../components/componentsCrearEvento/InputConfigEntradas'; // ok
import InputGeneroMusical from '../components/componentsCrearEvento/InputGeneroMusical'; // ok
import InputDescripcionEvento from '../components/componentsCrearEvento/InputDescripcionEvento'; // ok
import InputAfterOLbgt from '../components/componentsCrearEvento/InputAfterOLgbt'; // ok
import InputMultimedia from '../components/componentsCrearEvento/InputMultimedia';
import AclaracionModifEvento from '../components/componentsModifEvento/AclaracionModifEvento';
import api from '../componenteapi/api';
// import { AuthContext } from '../context/AuthContext';

const ModifDeEvento = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // const { user } = useContext(AuthContext);

  const [evento, setEvento] = useState(location.state?.evento || null);
  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcionEvento, setDescripcionEvento] = useState('');
  const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
  const [ubicacionEvento, setUbicacionEvento] = useState(null);
  const [artistasSeleccionados, setArtistasSeleccionados] = useState([]);
  const [afterOLgbt, setAfterOLgbt] = useState({ isAfter: false, isLgbt: false });
  const [fechaHoraEvento, setFechaHoraEvento] = useState([]);

  const setFechaHoraEventoCallback = useCallback((nuevasFechas) => {
    setFechaHoraEvento(nuevasFechas);
  }, []);

  const [entradasPorDia, setEntradasPorDia] = useState([]);
  const [preciosOriginales, setPreciosOriginales] = useState([]);
  const [configFechasVenta, setConfigFechasVenta] = useState([]);
  const [multimedia, setMultimedia] = useState({ soundCloud: '', videoUrl: '' });
  const [errorMultimedia, setErrorMultimedia] = useState(false);
  const [mediaImagenUrl, setMediaImagenUrl] = useState(null);
  const [mediaVideoUrl, setMediaVideoUrl] = useState('');
  const [confirmacionModificacion, setConfirmacionModificacion] = useState(false);
  const [estadoFechasOriginal, setEstadoFechasOriginal] = useState({});



  useEffect(() => {
  const idEvento = id || location.state?.evento?.idEvento;
  if (!idEvento) return;

  (async () => {
    try {
      const res = await api.get(`/Evento/GetEventos?IdEvento=${idEvento}`);
      const eventoApi = res.data.eventos?.[0];
      if (eventoApi) {
        setEvento(eventoApi);
        console.log('Evento (refrescado API):', eventoApi);
      } else {
        alert('No se encontró el evento.');
        navigate('/');
      }
    } catch (err) {
      console.error('Error al obtener evento:', err);
      alert('Error al cargar el evento.');
      navigate('/');
    }
  })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]); // ← clave: no dependas de "evento" acá


  // Cargar datos cuando el evento esté disponible
  useEffect(() => {
    if (!evento) return;

    console.log('Evento recibido:', evento);

    setNombreEvento(evento.nombre || '');
    setDescripcionEvento(evento.descripcion || '');
    setGenerosSeleccionados(evento.genero || []);
    setUbicacionEvento(evento.domicilio || null);
    setAfterOLgbt({
      isAfter: evento.isAfter || false,
      isLgbt: evento.isLgbt || false
    });
    setMultimedia(prev => ({
      ...prev,
      soundCloud: evento.soundCloud || ''
    }));

    if (evento.artistas && Array.isArray(evento.artistas)) {
      const artistasCompletos = evento.artistas.map(a => ({
        id: a.idArtista,
        nombre: a.nombre,
        esNuevo: false
      }));
      setArtistasSeleccionados(artistasCompletos);
    }

    if (evento.fechas) {
    const estados = {};
    evento.fechas.forEach(f => {
      estados[f.idFecha] = (f.estado ?? f.cdEstado);
    });
    setEstadoFechasOriginal(estados);

    setFechaHoraEvento(
      evento.fechas.map(f => ({
        idFecha: f.idFecha,
        inicio: f.inicio,
        fin: f.fin
      }))
    );
  }
}, [evento]);

  useEffect(() => {
    const cargarMedia = async () => {
      if (!evento?.idEvento) return;
      try {
        const resp = await api.get(`/Media?idEntidadMedia=${evento.idEvento}`);
        const medias = resp.data.media || [];

        const imagen = medias.find(m => m.url);
        const video = medias.find(m => m.mdVideo);

        setMediaImagenUrl(imagen?.url || null);
        setMediaVideoUrl(video?.mdVideo || '');
      } catch (err) {
        console.error('Error al cargar multimedia:', err);
      }
    };

    cargarMedia();
  }, [evento]);

  useEffect(() => {
    const fetchEntradasYFechasVenta = async () => {
      if (!evento?.fechas || evento.fechas.length === 0) return;

      try {
        const entradasPorFecha = [];
        const fechasVentaConfig = [];

        for (const fecha of evento.fechas) {
          const { idFecha } = fecha;
          const resEntradas = await api.get(`/Entrada/GetEntradasFecha?IdFecha=${idFecha}`);
          const entradas = resEntradas.data;

          const entradaDia = {
            generales: 0,
            generalesEarly: 0,
            vip: 0,
            vipEarly: 0,
            generalesPrice: '',
            generalesEarlyPrice: '',
            vipPrice: '',
            vipEarlyPrice: '',
          };

          for (const entrada of entradas) {
            const { tipo, cantidad, precio } = entrada;
            const cdTipo = tipo.cdTipo;
            switch (cdTipo) {
              case 0:
                entradaDia.generales = cantidad;
                entradaDia.generalesPrice = precio.toString();
                break;
              case 1:
                entradaDia.generalesEarly = cantidad;
                entradaDia.generalesEarlyPrice = precio.toString();
                break;
              case 2:
                entradaDia.vip = cantidad;
                entradaDia.vipPrice = precio.toString();
                break;
              case 3:
                entradaDia.vipEarly = cantidad;
                entradaDia.vipEarlyPrice = precio.toString();
                break;
              default:
                break;
            }
          }

          entradasPorFecha.push(entradaDia);
          fechasVentaConfig.push({
            inicioVenta: fecha.inicioVenta ? fecha.inicioVenta.slice(0, 16) : '',
            finVentaGeneralVip: fecha.finVenta ? fecha.finVenta.slice(0, 16) : '',
          });

          const preciosOriginalesAux = entradasPorFecha.map(entrada => ({
            generalesPrice: entrada.generalesPrice,
            generalesEarlyPrice: entrada.generalesEarlyPrice,
            vipPrice: entrada.vipPrice,
            vipEarlyPrice: entrada.vipEarlyPrice
          }));
          setPreciosOriginales(preciosOriginalesAux);
        }

        setEntradasPorDia(entradasPorFecha);
        setConfigFechasVenta(fechasVentaConfig);
      } catch (error) {
        console.error('Error al cargar entradas y configuración de fechas:', error);
      }
    };

    fetchEntradasYFechasVenta();
  }, [evento]);

  const validarFormulario = () => {
    if (!nombreEvento.trim()) return alert('Ingresá el nombre del evento.');
    if (!ubicacionEvento?.provincia || !ubicacionEvento?.direccion) return alert('Completá los datos de ubicación.');
    if (!generosSeleccionados.length) return alert('Seleccioná al menos un género.');
    if (!artistasSeleccionados.length) return alert('Seleccioná al menos un artista.');
    if (!descripcionEvento.trim()) return alert('Ingresá una descripción.');
    if (!fechaHoraEvento.length) return alert('Completá las fechas y horarios.');
    if (errorMultimedia) {
      alert('El link de SoundCloud o Youtube no es válido. Solo se aceptan enlaces de soundcloud.com y youtube.com.');
      return false;
    }
    if (!confirmacionModificacion) {
      alert('Debes confirmar que deseas modificar el evento.');
      return false;
    }
    return true;
  };

  const actualizarEvento = async () => {
    if (!validarFormulario()) return;

    try {

      const DEFAULT_ESTADO_FECHA_NUEVA = 0; // ajustáar segun criterio

      const payload = {
        idEvento: evento.idEvento,
        idArtistas: artistasSeleccionados.map(a => a.id),
        domicilio: ubicacionEvento,
        nombre: nombreEvento,
        descripcion: descripcionEvento,
        genero: generosSeleccionados,
        isAfter: afterOLgbt.isAfter,
        isLgbt: afterOLgbt.isLgbt,
        inicioEvento: fechaHoraEvento[0]?.inicio,
        finEvento: fechaHoraEvento[fechaHoraEvento.length - 1]?.fin,
        estado: evento.cdEstado, // top-level del evento
        fechas: fechaHoraEvento.map((dia, i) => {
          const estadoOriginal =
            estadoFechasOriginal[dia.idFecha] ??
            evento.fechas?.find(f => f.idFecha === dia.idFecha)?.estado;

          return {
            idFecha: dia.idFecha,                 // si es nueva, probablemente sea undefined/null
            inicio: dia.inicio,
            fin: dia.fin,
            inicioVenta: configFechasVenta[i]?.inicioVenta || '2025-01-01T00:00:00',
            finVenta:   configFechasVenta[i]?.finVentaGeneralVip || '2025-01-02T00:00:00',
            estado: (dia.idFecha ? estadoOriginal : DEFAULT_ESTADO_FECHA_NUEVA)
          };
        }),
        idFiesta: evento.idFiesta || null,
        soundCloud: multimedia.soundCloud?.trim() || null
      };



      console.log('Payload a enviar:', payload);
      await api.put('/Evento/UpdateEvento', payload);
      await actualizarMultimedia();
      await actualizarPreciosEntradas();
      alert('Evento actualizado correctamente.');
      navigate('/mis-eventos-creados');
    } catch (err) {
      console.error('Error al actualizar evento:', err);
      alert('Ocurrió un error al actualizar el evento.');
    }
  };

  const actualizarPreciosEntradas = async () => {
  if (!evento?.fechas || evento.fechas.length === 0) return;

  try {
    const tiposEntrada = [
      { campo: 'generalesPrice', cdTipo: 0 },
      { campo: 'generalesEarlyPrice', cdTipo: 1 },
      { campo: 'vipPrice', cdTipo: 2 },
      { campo: 'vipEarlyPrice', cdTipo: 3 },
    ];

    for (let i = 0; i < evento.fechas.length; i++) {
      const idFecha = evento.fechas[i].idFecha;
      const preciosOriginal = preciosOriginales[i];
      const preciosActuales = entradasPorDia[i];

      for (const tipo of tiposEntrada) {
        const original = preciosOriginal?.[tipo.campo] || '';
        const actual = preciosActuales?.[tipo.campo] || '';

        if (original !== actual) {
          await api.put('/Entrada/UpdateEntrada', {
            idFecha,
            tipo: tipo.cdTipo,
            precio: parseInt(actual, 10) || 0
          });
        }
      }
    }

    console.log('Precios de entradas actualizados correctamente');
  } catch (err) {
    console.error('Error al actualizar precios de entradas:', err);
    alert('Error al actualizar precios de entradas.');
  }
};

const actualizarMultimedia = async () => {
  try {
    let medias = [];

    try {
      const mediaResp = await api.get(`/Media?idEntidadMedia=${evento.idEvento}`);
      medias = mediaResp.data.media || [];
    } catch (err) {
      // Si el error es 404, significa que no hay multimedia aún, lo manejamos como caso normal
      if (err.response && err.response.status !== 404) {
        throw err; // Otros errores los dejamos caer al catch principal
      }
    }

    const imagenExistente = medias.find(m => m.url);
    const videoExistente = medias.find(m => m.mdVideo);

    if (multimedia.file) {
      if (imagenExistente?.idMedia) await api.delete(`/Media/${imagenExistente.idMedia}`);

      const formData = new FormData();
      formData.append('IdEntidadMedia', evento.idEvento);
      formData.append('File', multimedia.file);

      await api.post('/Media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    if (multimedia.videoUrl) {
      if (videoExistente?.idMedia) await api.delete(`/Media/${videoExistente.idMedia}`);

      const formDataVideo = new FormData();
      formDataVideo.append('IdEntidadMedia', evento.idEvento);
      formDataVideo.append('File', null);
      formDataVideo.append('Video', multimedia.videoUrl);

      await api.post('/Media', formDataVideo, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
  } catch (err) {
    console.error('Error al actualizar multimedia:', err);
    alert('Error al actualizar la imagen o video del evento.');
  }
};

  if (!evento) {
    return <div className="p-10">Cargando evento...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
    <div className="sm:px-10 mb-11">
      <NavBar />
      <h1 className="px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">Modificar Evento</h1>

      <AclaracionModifEvento />

      <form className="px-10">
  <div className="form-control w-full mb-4">
    <label className="label font-semibold text-lg">Nombre del evento:</label>
    <input
      type="text"
      className="input input-bordered w-full max-w-lg"
      value={nombreEvento}
      onChange={(e) => setNombreEvento(e.target.value)}
    />
  </div>

  <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

  <InputGeneroMusical
    onSeleccionGeneros={setGenerosSeleccionados}
    valorInicial={evento?.genero || []}
  />

  <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

  <InputDeArtistas
    onSeleccionarArtistas={setArtistasSeleccionados}
    artistasIniciales={artistasSeleccionados}
  />

  <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

  <InputUbicacionEvento
    onUbicacionChange={setUbicacionEvento}
    ubicacionInicial={evento?.domicilio}
  />

  <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

  <InputAfterOLbgt
    onSeleccion={setAfterOLgbt}
    valoresIniciales={{
      isAfter: evento?.isAfter || false,
      isLgbt: evento?.isLgbt || false
    }}
  />

  <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

  <InputDescripcionEvento
    onDescripcionChange={setDescripcionEvento}
    valorInicial={evento?.descripcion || ''}
  />

  <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

  {fechaHoraEvento.length > 0 && (
    <InputFechaHoraEvento
      diasEvento={fechaHoraEvento.length}
      onFechaHoraChange={setFechaHoraEventoCallback}
      fechasIniciales={fechaHoraEvento}
    />
  )}

  <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

  <InputEntradasCantPrecio
    diasEvento={fechaHoraEvento.length}
    onEntradasChange={setEntradasPorDia}
    entradasIniciales={entradasPorDia}
    soloEditarPrecios={true}
  />

  <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

  <InputConfigEntradas
    diasEvento={fechaHoraEvento.length}
    entradasPorDia={entradasPorDia}
    onConfigEntradasChange={setConfigFechasVenta}
    configInicial={configFechasVenta}
  />

  <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

  <InputMultimedia
    onMultimediaChange={setMultimedia}
    onErrorChange={setErrorMultimedia}
    imagenInicial={mediaImagenUrl}
    videoInicial={mediaVideoUrl}
    soundCloudInicial={evento?.soundCloud}
  />

  <div className="form-control mb-4 mt-6">
  <label className="cursor-pointer label justify-start">
    <input
      type="checkbox"
      className="checkbox checkbox-accent mr-2"
      checked={confirmacionModificacion}
      onChange={(e) => setConfirmacionModificacion(e.target.checked)}
    />
    <span className="label-text">Confirmo que deseo modificar el evento</span>
  </label>
</div>


  <button
    type="button"
    onClick={actualizarEvento}
    className="btn btn-primary bg-blue-600 text-white rounded-xl"
  >
    Guardar cambios
  </button>
</form>

      
    </div>
    <Footer />
    </div>
  );
};

export default ModifDeEvento;