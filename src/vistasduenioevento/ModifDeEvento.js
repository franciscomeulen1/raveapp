import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas';
import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento';
import InputFechaHoraEvento from '../components/componentsCrearEvento/InputFechaHoraEvento';
import InputEntradasCantPrecio from '../components/componentsCrearEvento/InputEntradasCantPrecio';
import InputConfigEntradas from '../components/componentsCrearEvento/InputConfigEntradas';
import InputGeneroMusical from '../components/componentsCrearEvento/InputGeneroMusical';
import InputDescripcionEvento from '../components/componentsCrearEvento/InputDescripcionEvento';
import InputAfterOLbgt from '../components/componentsCrearEvento/InputAfterOLgbt';
import InputMultimedia from '../components/componentsCrearEvento/InputMultimedia';
import CheckTyC from '../components/componentCheckTyC/CheckTyC';
import AclaracionModifEvento from '../components/componentsModifEvento/AclaracionModifEvento';
import { enviarMailModifEvento } from '../components/componentsModifEvento/enviarMailModifEvento';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

const ModifDeEvento = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // usuario logueado

  // --- estados principales ---
  const [evento, setEvento] = useState(location.state?.evento || null);
  const [noAutorizado, setNoAutorizado] = useState(false);
  const [estadoNoEditable, setEstadoNoEditable] = useState(false); // <<--- NUEVO

  const [nombreEvento, setNombreEvento] = useState('');
  const [descripcionEvento, setDescripcionEvento] = useState('');
  const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
  const [ubicacionEvento, setUbicacionEvento] = useState(null);
  const [artistasSeleccionados, setArtistasSeleccionados] = useState([]);
  const [afterOLgbt, setAfterOLgbt] = useState({ isAfter: false, isLgbt: false });
  const [fechaHoraEvento, setFechaHoraEvento] = useState([]);
  const [aceptaTyC, setAceptaTyC] = useState(false);

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

  // modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- 1. cargar evento (GET directo si entro por URL) y chequear propietario + estado ---
  useEffect(() => {
    const idEvento = id || location.state?.evento?.idEvento;
    if (!idEvento) return;

    (async () => {
      try {
        const res = await api.get(`/Evento/GetEventos?IdEvento=${idEvento}`);
        const eventoApi = res.data.eventos?.[0];

        if (!eventoApi) {
          setNoAutorizado(true);
          return;
        }

        // chequeo de propietario
        const idOwnerEvento = eventoApi.usuario?.idUsuario;
        const idUsuarioLogueado = user?.id; // tu AuthContext usa user.id

        if (!idUsuarioLogueado || idOwnerEvento !== idUsuarioLogueado) {
          setNoAutorizado(true);
          return;
        }

        // chequeo de estado permitido (0, 1 o 2)
        const estadoEvento = eventoApi.cdEstado ?? eventoApi.estado ?? 0;
        const estadosPermitidos = [0, 1, 2];
        if (!estadosPermitidos.includes(estadoEvento)) {
          // es tuyo, pero no está en un estado que puedas modificar
          setEvento(eventoApi); // lo guardo igual para mostrar el nombre en el mensaje
          setEstadoNoEditable(true);
          return;
        }

        // si es tuyo y está en estado permitido
        setEvento(eventoApi);
        setNoAutorizado(false);
        setEstadoNoEditable(false);
        console.log('Evento (refrescado API):', eventoApi);
      } catch (err) {
        console.error('Error al obtener evento:', err);
        setNoAutorizado(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  // --- 2. Cargar datos en estados locales cuando evento está disponible ---
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

  // --- 3. cargar multimedia (imagen/video asociados al evento) ---
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

  // --- 4. cargar entradas + config de fechas de venta ---
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

  // --- VALIDACIÓN DEL FORM ---
  const validarFormulario = () => {
    if (!nombreEvento.trim()) return alert('Ingresá el nombre del evento.');

    if (
      !ubicacionEvento?.provincia?.nombre ||
      !ubicacionEvento?.municipio?.nombre ||
      !ubicacionEvento?.localidad?.nombre ||
      !ubicacionEvento?.direccion
    ) {
      alert('Completá provincia, municipio, localidad y dirección.');
      return false;
    }

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
    if (!aceptaTyC) {
      alert('Debes aceptar los términos y condiciones para continuar.');
      return false;
    }
    return true;
  };

  // --- PUT del evento ---
    const actualizarEvento = async () => {
    if (!validarFormulario()) return;

    try {
      const DEFAULT_ESTADO_FECHA_NUEVA = 0; // estado por defecto si se agrega una nueva fecha

      // Normalizar domicilio
      const domicilioNormalizado = ubicacionEvento
        ? {
            provincia: ubicacionEvento.provincia
              ? {
                  nombre: ubicacionEvento.provincia.nombre || ubicacionEvento.provincia,
                  codigo:
                    ubicacionEvento.provincia.codigo ||
                    ubicacionEvento.provinciaCodigo ||
                    ''
                }
              : { nombre: '', codigo: '' },
            municipio: ubicacionEvento.municipio
              ? {
                  nombre: ubicacionEvento.municipio.nombre || ubicacionEvento.municipio,
                  codigo:
                    ubicacionEvento.municipio.codigo ||
                    ubicacionEvento.municipioCodigo ||
                    ''
                }
              : { nombre: '', codigo: '' },
            localidad: ubicacionEvento.localidad
              ? {
                  nombre: ubicacionEvento.localidad.nombre || ubicacionEvento.localidad,
                  codigo:
                    ubicacionEvento.localidad.codigo ||
                    ubicacionEvento.localidadCodigo ||
                    ''
                }
              : { nombre: '', codigo: '' },
            direccion: ubicacionEvento.direccion || '',
            latitud: ubicacionEvento.latitud ?? 0,
            longitud: ubicacionEvento.longitud ?? 0,
          }
        : null;

      const fechasPayload = fechaHoraEvento.map((dia, i) => {
        const originalFecha = evento.fechas?.find(f => f.idFecha === dia.idFecha) || {};

        const estadoOriginal =
          estadoFechasOriginal[dia.idFecha] ??
          originalFecha.estado ??
          0;

        const inicioVentaVal =
          configFechasVenta[i]?.inicioVenta ||
          originalFecha.inicioVenta ||
          '2025-01-01T00:00:00';

        const finVentaVal =
          configFechasVenta[i]?.finVentaGeneralVip ||
          originalFecha.finVenta ||
          '2025-01-02T00:00:00';

        return {
          idFecha: dia.idFecha,
          inicio: dia.inicio,
          fin: dia.fin,
          inicioVenta: inicioVentaVal,
          finVenta: finVentaVal,
          estado: dia.idFecha ? estadoOriginal : DEFAULT_ESTADO_FECHA_NUEVA,
        };
      });

      const payload = {
        idEvento: evento.idEvento,
        idArtistas: artistasSeleccionados.map(a => a.id),
        domicilio: domicilioNormalizado,
        nombre: nombreEvento,
        descripcion: descripcionEvento,
        genero: generosSeleccionados,
        isAfter: afterOLgbt.isAfter,
        isLgbt: afterOLgbt.isLgbt,
        inicioEvento: fechaHoraEvento[0]?.inicio,
        finEvento: fechaHoraEvento[fechaHoraEvento.length - 1]?.fin,
        estado: (evento.cdEstado ?? evento.estado ?? 0),
        fechas: fechasPayload,
        idFiesta: evento.idFiesta || null,
        soundCloud: multimedia.soundCloud?.trim() || null
      };

      console.log('Payload a enviar (FINAL):', payload);

      // 1) Actualizar el evento
      await api.put('/Evento/UpdateEvento', payload);

      // 2) Actualizar multimedia
      await actualizarMultimedia();

      // 3) Actualizar precios de entradas
      await actualizarPreciosEntradas();

      // 4) Enviar mails a compradores (404 esperado si no hay entradas en estado paga)
      await enviarMailModifEvento({
        idEvento: evento.idEvento,
        nombreEvento: nombreEvento,
      });

      // 5) Mostrar modal de éxito
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error al actualizar evento:', err);
      alert('Ocurrió un error al actualizar el evento.');
    }
  };


  // --- PUT precios de entradas ---
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

  // --- Multimedia (imagen / video) ---
  const actualizarMultimedia = async () => {
    try {
      let medias = [];

      try {
        const mediaResp = await api.get(`/Media?idEntidadMedia=${evento.idEvento}`);
        medias = mediaResp.data.media || [];
      } catch (err) {
        if (err.response && err.response.status !== 404) {
          throw err;
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

  // --- Render alternativo si no es tu evento o no existe ---
  if (noAutorizado) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 sm:px-10 mb-11">
          <NavBar />
          <div className="px-10 py-20 text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Evento a modificar no propio, o no encontrado
            </h1>
            <button
              className="btn mt-6 bg-purple-600 text-white rounded-xl"
              onClick={() => navigate('/mis-eventos-creados')}
            >
              Volver a mis eventos
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Render alternativo si el evento es tuyo pero su estado no permite modificar ---
  if (estadoNoEditable) {
    const nombreFromState = location.state?.evento?.nombre;
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 sm:px-10 mb-11">
          <NavBar />
          <div className="container mx-auto px-4 py-10 text-center">
            <h1 className="text-2xl font-bold mb-4">No se puede modificar este evento.</h1>
            <p className="text-red-600 font-semibold mb-2">
              Solo puedes modificar eventos que estén <strong>por aprobar</strong>,{' '}
              <strong>aprobados</strong> o <strong>en venta</strong>.
            </p>
            <p className="mb-6">
              Estabas intentando modificar:{' '}
              <span className="font-bold">
                {evento?.nombre || nombreFromState || 'Evento desconocido'}
              </span>
            </p>
            <button
              className="btn btn-info"
              onClick={() => navigate('/mis-eventos-creados')}
            >
              Volver a mis eventos
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Render normal mientras evento todavía no está cargado ---
  if (!evento) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 sm:px-10 mb-11">
          <NavBar />
          <div className="px-10 py-20 text-center">
            <p className="text-lg">Cargando evento...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sm:px-10 mb-11 relative">
        <NavBar />
        <h1 className="px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
          Modificar Evento
        </h1>

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

          <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

          <InputGeneroMusical
            onSeleccionGeneros={setGenerosSeleccionados}
            valorInicial={evento?.genero || []}
          />

          <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

          <InputDeArtistas
            onSeleccionarArtistas={setArtistasSeleccionados}
            artistasIniciales={artistasSeleccionados}
          />

          <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

          <InputUbicacionEvento
            onUbicacionChange={setUbicacionEvento}
            ubicacionInicial={evento?.domicilio}
          />

          <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

          <InputAfterOLbgt
            onSeleccion={setAfterOLgbt}
            valoresIniciales={{
              isAfter: evento?.isAfter || false,
              isLgbt: evento?.isLgbt || false
            }}
          />

          <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

          <InputDescripcionEvento
            onDescripcionChange={setDescripcionEvento}
            valorInicial={evento?.descripcion || ''}
          />

          <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

          {fechaHoraEvento.length > 0 && (
            <InputFechaHoraEvento
              diasEvento={fechaHoraEvento.length}
              onFechaHoraChange={setFechaHoraEventoCallback}
              fechasIniciales={fechaHoraEvento}
            />
          )}

          <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

          <InputEntradasCantPrecio
            diasEvento={fechaHoraEvento.length}
            onEntradasChange={setEntradasPorDia}
            entradasIniciales={entradasPorDia}
            soloEditarPrecios={true}
          />

          <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

          <InputConfigEntradas
            diasEvento={fechaHoraEvento.length}
            entradasPorDia={entradasPorDia}
            onConfigEntradasChange={setConfigFechasVenta}
            configInicial={configFechasVenta}
          />

          <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

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

          <CheckTyC onChange={setAceptaTyC} />

          <button
            type="button"
            onClick={actualizarEvento}
            className="btn btn-primary bg-blue-600 text-white rounded-xl"
          >
            Guardar cambios
          </button>

        </form>

        {/* MODAL DE ÉXITO */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full text-center">
              <h2 className="text-xl font-bold text-green-600 mb-4">
                Evento modificado exitosamente
              </h2>
              <p className="mb-6 text-gray-700">
                Tu evento se actualizó correctamente.
              </p>
              <button
                className="btn bg-blue-600 text-white rounded-xl w-full"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/mis-eventos-creados');
                }}
              >
                Ok
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ModifDeEvento;


// import React, { useState, useEffect, useCallback, useContext } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas';
// import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento';
// import InputFechaHoraEvento from '../components/componentsCrearEvento/InputFechaHoraEvento';
// import InputEntradasCantPrecio from '../components/componentsCrearEvento/InputEntradasCantPrecio';
// import InputConfigEntradas from '../components/componentsCrearEvento/InputConfigEntradas';
// import InputGeneroMusical from '../components/componentsCrearEvento/InputGeneroMusical';
// import InputDescripcionEvento from '../components/componentsCrearEvento/InputDescripcionEvento';
// import InputAfterOLbgt from '../components/componentsCrearEvento/InputAfterOLgbt';
// import InputMultimedia from '../components/componentsCrearEvento/InputMultimedia';
// import AclaracionModifEvento from '../components/componentsModifEvento/AclaracionModifEvento';
// import { enviarMailModifEvento } from '../components/componentsModifEvento/enviarMailModifEvento';
// import api from '../componenteapi/api';
// import { AuthContext } from '../context/AuthContext';

// const ModifDeEvento = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext); // usuario logueado

//   // --- estados principales ---
//   const [evento, setEvento] = useState(location.state?.evento || null);
//   const [noAutorizado, setNoAutorizado] = useState(false);
//   const [estadoNoEditable, setEstadoNoEditable] = useState(false); // <<--- NUEVO

//   const [nombreEvento, setNombreEvento] = useState('');
//   const [descripcionEvento, setDescripcionEvento] = useState('');
//   const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
//   const [ubicacionEvento, setUbicacionEvento] = useState(null);
//   const [artistasSeleccionados, setArtistasSeleccionados] = useState([]);
//   const [afterOLgbt, setAfterOLgbt] = useState({ isAfter: false, isLgbt: false });
//   const [fechaHoraEvento, setFechaHoraEvento] = useState([]);

//   const setFechaHoraEventoCallback = useCallback((nuevasFechas) => {
//     setFechaHoraEvento(nuevasFechas);
//   }, []);

//   const [entradasPorDia, setEntradasPorDia] = useState([]);
//   const [preciosOriginales, setPreciosOriginales] = useState([]);
//   const [configFechasVenta, setConfigFechasVenta] = useState([]);
//   const [multimedia, setMultimedia] = useState({ soundCloud: '', videoUrl: '' });
//   const [errorMultimedia, setErrorMultimedia] = useState(false);
//   const [mediaImagenUrl, setMediaImagenUrl] = useState(null);
//   const [mediaVideoUrl, setMediaVideoUrl] = useState('');
//   const [confirmacionModificacion, setConfirmacionModificacion] = useState(false);
//   const [estadoFechasOriginal, setEstadoFechasOriginal] = useState({});

//   // modal de éxito
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   // --- 1. cargar evento (GET directo si entro por URL) y chequear propietario + estado ---
//   useEffect(() => {
//     const idEvento = id || location.state?.evento?.idEvento;
//     if (!idEvento) return;

//     (async () => {
//       try {
//         const res = await api.get(`/Evento/GetEventos?IdEvento=${idEvento}`);
//         const eventoApi = res.data.eventos?.[0];

//         if (!eventoApi) {
//           setNoAutorizado(true);
//           return;
//         }

//         // chequeo de propietario
//         const idOwnerEvento = eventoApi.usuario?.idUsuario;
//         const idUsuarioLogueado = user?.id; // tu AuthContext usa user.id

//         if (!idUsuarioLogueado || idOwnerEvento !== idUsuarioLogueado) {
//           setNoAutorizado(true);
//           return;
//         }

//         // chequeo de estado permitido (0, 1 o 2)
//         const estadoEvento = eventoApi.cdEstado ?? eventoApi.estado ?? 0;
//         const estadosPermitidos = [0, 1, 2];
//         if (!estadosPermitidos.includes(estadoEvento)) {
//           // es tuyo, pero no está en un estado que puedas modificar
//           setEvento(eventoApi); // lo guardo igual para mostrar el nombre en el mensaje
//           setEstadoNoEditable(true);
//           return;
//         }

//         // si es tuyo y está en estado permitido
//         setEvento(eventoApi);
//         setNoAutorizado(false);
//         setEstadoNoEditable(false);
//         console.log('Evento (refrescado API):', eventoApi);
//       } catch (err) {
//         console.error('Error al obtener evento:', err);
//         setNoAutorizado(true);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id, user]);

//   // --- 2. Cargar datos en estados locales cuando evento está disponible ---
//   useEffect(() => {
//     if (!evento) return;

//     console.log('Evento recibido:', evento);

//     setNombreEvento(evento.nombre || '');
//     setDescripcionEvento(evento.descripcion || '');
//     setGenerosSeleccionados(evento.genero || []);
//     setUbicacionEvento(evento.domicilio || null);
//     setAfterOLgbt({
//       isAfter: evento.isAfter || false,
//       isLgbt: evento.isLgbt || false
//     });
//     setMultimedia(prev => ({
//       ...prev,
//       soundCloud: evento.soundCloud || ''
//     }));

//     if (evento.artistas && Array.isArray(evento.artistas)) {
//       const artistasCompletos = evento.artistas.map(a => ({
//         id: a.idArtista,
//         nombre: a.nombre,
//         esNuevo: false
//       }));
//       setArtistasSeleccionados(artistasCompletos);
//     }

//     if (evento.fechas) {
//       const estados = {};
//       evento.fechas.forEach(f => {
//         estados[f.idFecha] = (f.estado ?? f.cdEstado);
//       });
//       setEstadoFechasOriginal(estados);

//       setFechaHoraEvento(
//         evento.fechas.map(f => ({
//           idFecha: f.idFecha,
//           inicio: f.inicio,
//           fin: f.fin
//         }))
//       );
//     }
//   }, [evento]);

//   // --- 3. cargar multimedia (imagen/video asociados al evento) ---
//   useEffect(() => {
//     const cargarMedia = async () => {
//       if (!evento?.idEvento) return;
//       try {
//         const resp = await api.get(`/Media?idEntidadMedia=${evento.idEvento}`);
//         const medias = resp.data.media || [];

//         const imagen = medias.find(m => m.url);
//         const video = medias.find(m => m.mdVideo);

//         setMediaImagenUrl(imagen?.url || null);
//         setMediaVideoUrl(video?.mdVideo || '');
//       } catch (err) {
//         console.error('Error al cargar multimedia:', err);
//       }
//     };

//     cargarMedia();
//   }, [evento]);

//   // --- 4. cargar entradas + config de fechas de venta ---
//   useEffect(() => {
//     const fetchEntradasYFechasVenta = async () => {
//       if (!evento?.fechas || evento.fechas.length === 0) return;

//       try {
//         const entradasPorFecha = [];
//         const fechasVentaConfig = [];

//         for (const fecha of evento.fechas) {
//           const { idFecha } = fecha;
//           const resEntradas = await api.get(`/Entrada/GetEntradasFecha?IdFecha=${idFecha}`);
//           const entradas = resEntradas.data;

//           const entradaDia = {
//             generales: 0,
//             generalesEarly: 0,
//             vip: 0,
//             vipEarly: 0,
//             generalesPrice: '',
//             generalesEarlyPrice: '',
//             vipPrice: '',
//             vipEarlyPrice: '',
//           };

//           for (const entrada of entradas) {
//             const { tipo, cantidad, precio } = entrada;
//             const cdTipo = tipo.cdTipo;
//             switch (cdTipo) {
//               case 0:
//                 entradaDia.generales = cantidad;
//                 entradaDia.generalesPrice = precio.toString();
//                 break;
//               case 1:
//                 entradaDia.generalesEarly = cantidad;
//                 entradaDia.generalesEarlyPrice = precio.toString();
//                 break;
//               case 2:
//                 entradaDia.vip = cantidad;
//                 entradaDia.vipPrice = precio.toString();
//                 break;
//               case 3:
//                 entradaDia.vipEarly = cantidad;
//                 entradaDia.vipEarlyPrice = precio.toString();
//                 break;
//               default:
//                 break;
//             }
//           }

//           entradasPorFecha.push(entradaDia);
//           fechasVentaConfig.push({
//             inicioVenta: fecha.inicioVenta ? fecha.inicioVenta.slice(0, 16) : '',
//             finVentaGeneralVip: fecha.finVenta ? fecha.finVenta.slice(0, 16) : '',
//           });

//           const preciosOriginalesAux = entradasPorFecha.map(entrada => ({
//             generalesPrice: entrada.generalesPrice,
//             generalesEarlyPrice: entrada.generalesEarlyPrice,
//             vipPrice: entrada.vipPrice,
//             vipEarlyPrice: entrada.vipEarlyPrice
//           }));
//           setPreciosOriginales(preciosOriginalesAux);
//         }

//         setEntradasPorDia(entradasPorFecha);
//         setConfigFechasVenta(fechasVentaConfig);
//       } catch (error) {
//         console.error('Error al cargar entradas y configuración de fechas:', error);
//       }
//     };

//     fetchEntradasYFechasVenta();
//   }, [evento]);

//   // --- VALIDACIÓN DEL FORM ---
//   const validarFormulario = () => {
//     if (!nombreEvento.trim()) return alert('Ingresá el nombre del evento.');

//     if (
//       !ubicacionEvento?.provincia?.nombre ||
//       !ubicacionEvento?.municipio?.nombre ||
//       !ubicacionEvento?.localidad?.nombre ||
//       !ubicacionEvento?.direccion
//     ) {
//       alert('Completá provincia, municipio, localidad y dirección.');
//       return false;
//     }

//     if (!generosSeleccionados.length) return alert('Seleccioná al menos un género.');
//     if (!artistasSeleccionados.length) return alert('Seleccioná al menos un artista.');
//     if (!descripcionEvento.trim()) return alert('Ingresá una descripción.');
//     if (!fechaHoraEvento.length) return alert('Completá las fechas y horarios.');

//     if (errorMultimedia) {
//       alert('El link de SoundCloud o Youtube no es válido. Solo se aceptan enlaces de soundcloud.com y youtube.com.');
//       return false;
//     }
//     if (!confirmacionModificacion) {
//       alert('Debes confirmar que deseas modificar el evento.');
//       return false;
//     }
//     return true;
//   };

//   // --- PUT del evento ---
//   const actualizarEvento = async () => {
//     if (!validarFormulario()) return;

//     try {
//       const DEFAULT_ESTADO_FECHA_NUEVA = 0; // estado por defecto si se agrega una nueva fecha

//       // Normalizar domicilio
//       const domicilioNormalizado = ubicacionEvento
//         ? {
//             provincia: ubicacionEvento.provincia
//               ? {
//                   nombre: ubicacionEvento.provincia.nombre || ubicacionEvento.provincia,
//                   codigo:
//                     ubicacionEvento.provincia.codigo ||
//                     ubicacionEvento.provinciaCodigo ||
//                     ''
//                 }
//               : { nombre: '', codigo: '' },
//             municipio: ubicacionEvento.municipio
//               ? {
//                   nombre: ubicacionEvento.municipio.nombre || ubicacionEvento.municipio,
//                   codigo:
//                     ubicacionEvento.municipio.codigo ||
//                     ubicacionEvento.municipioCodigo ||
//                     ''
//                 }
//               : { nombre: '', codigo: '' },
//             localidad: ubicacionEvento.localidad
//               ? {
//                   nombre: ubicacionEvento.localidad.nombre || ubicacionEvento.localidad,
//                   codigo:
//                     ubicacionEvento.localidad.codigo ||
//                     ubicacionEvento.localidadCodigo ||
//                     ''
//                 }
//               : { nombre: '', codigo: '' },
//             direccion: ubicacionEvento.direccion || '',
//             latitud: ubicacionEvento.latitud ?? 0,
//             longitud: ubicacionEvento.longitud ?? 0,
//           }
//         : null;

//       const fechasPayload = fechaHoraEvento.map((dia, i) => {
//         const originalFecha = evento.fechas?.find(f => f.idFecha === dia.idFecha) || {};

//         const estadoOriginal =
//           estadoFechasOriginal[dia.idFecha] ??
//           originalFecha.estado ??
//           0;

//         const inicioVentaVal =
//           configFechasVenta[i]?.inicioVenta ||
//           originalFecha.inicioVenta ||
//           '2025-01-01T00:00:00';

//         const finVentaVal =
//           configFechasVenta[i]?.finVentaGeneralVip ||
//           originalFecha.finVenta ||
//           '2025-01-02T00:00:00';

//         return {
//           idFecha: dia.idFecha,
//           inicio: dia.inicio,
//           fin: dia.fin,
//           inicioVenta: inicioVentaVal,
//           finVenta: finVentaVal,
//           estado: dia.idFecha ? estadoOriginal : DEFAULT_ESTADO_FECHA_NUEVA,
//         };
//       });

//       const payload = {
//         idEvento: evento.idEvento,
//         idArtistas: artistasSeleccionados.map(a => a.id),
//         domicilio: domicilioNormalizado,
//         nombre: nombreEvento,
//         descripcion: descripcionEvento,
//         genero: generosSeleccionados,
//         isAfter: afterOLgbt.isAfter,
//         isLgbt: afterOLgbt.isLgbt,
//         inicioEvento: fechaHoraEvento[0]?.inicio,
//         finEvento: fechaHoraEvento[fechaHoraEvento.length - 1]?.fin,
//         estado: (evento.cdEstado ?? evento.estado ?? 0),
//         fechas: fechasPayload,
//         idFiesta: evento.idFiesta || null,
//         soundCloud: multimedia.soundCloud?.trim() || null
//       };

//       console.log('Payload a enviar (FINAL):', payload);

//       await api.put('/Evento/UpdateEvento', payload);
//       await actualizarMultimedia();
//       await actualizarPreciosEntradas();

//       setShowSuccessModal(true);
//     } catch (err) {
//       console.error('Error al actualizar evento:', err);
//       alert('Ocurrió un error al actualizar el evento.');
//     }
//   };

//   // --- PUT precios de entradas ---
//   const actualizarPreciosEntradas = async () => {
//     if (!evento?.fechas || evento.fechas.length === 0) return;

//     try {
//       const tiposEntrada = [
//         { campo: 'generalesPrice', cdTipo: 0 },
//         { campo: 'generalesEarlyPrice', cdTipo: 1 },
//         { campo: 'vipPrice', cdTipo: 2 },
//         { campo: 'vipEarlyPrice', cdTipo: 3 },
//       ];

//       for (let i = 0; i < evento.fechas.length; i++) {
//         const idFecha = evento.fechas[i].idFecha;
//         const preciosOriginal = preciosOriginales[i];
//         const preciosActuales = entradasPorDia[i];

//         for (const tipo of tiposEntrada) {
//           const original = preciosOriginal?.[tipo.campo] || '';
//           const actual = preciosActuales?.[tipo.campo] || '';

//           if (original !== actual) {
//             await api.put('/Entrada/UpdateEntrada', {
//               idFecha,
//               tipo: tipo.cdTipo,
//               precio: parseInt(actual, 10) || 0
//             });
//           }
//         }
//       }

//       console.log('Precios de entradas actualizados correctamente');
//     } catch (err) {
//       console.error('Error al actualizar precios de entradas:', err);
//       alert('Error al actualizar precios de entradas.');
//     }
//   };

//   // --- Multimedia (imagen / video) ---
//   const actualizarMultimedia = async () => {
//     try {
//       let medias = [];

//       try {
//         const mediaResp = await api.get(`/Media?idEntidadMedia=${evento.idEvento}`);
//         medias = mediaResp.data.media || [];
//       } catch (err) {
//         if (err.response && err.response.status !== 404) {
//           throw err;
//         }
//       }

//       const imagenExistente = medias.find(m => m.url);
//       const videoExistente = medias.find(m => m.mdVideo);

//       if (multimedia.file) {
//         if (imagenExistente?.idMedia) await api.delete(`/Media/${imagenExistente.idMedia}`);

//         const formData = new FormData();
//         formData.append('IdEntidadMedia', evento.idEvento);
//         formData.append('File', multimedia.file);

//         await api.post('/Media', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       }

//       if (multimedia.videoUrl) {
//         if (videoExistente?.idMedia) await api.delete(`/Media/${videoExistente.idMedia}`);

//         const formDataVideo = new FormData();
//         formDataVideo.append('IdEntidadMedia', evento.idEvento);
//         formDataVideo.append('File', null);
//         formDataVideo.append('Video', multimedia.videoUrl);

//         await api.post('/Media', formDataVideo, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       }
//     } catch (err) {
//       console.error('Error al actualizar multimedia:', err);
//       alert('Error al actualizar la imagen o video del evento.');
//     }
//   };

//   // --- Render alternativo si no es tu evento o no existe ---
//   if (noAutorizado) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <div className="flex-1 sm:px-10 mb-11">
//           <NavBar />
//           <div className="px-10 py-20 text-center">
//             <h1 className="text-2xl font-bold text-red-600">
//               Evento a modificar no propio, o no encontrado
//             </h1>
//             <button
//               className="btn mt-6 bg-purple-600 text-white rounded-xl"
//               onClick={() => navigate('/mis-eventos-creados')}
//             >
//               Volver a mis eventos
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // --- Render alternativo si el evento es tuyo pero su estado no permite modificar ---
//   if (estadoNoEditable) {
//     const nombreFromState = location.state?.evento?.nombre;
//     return (
//       <div className="flex flex-col min-h-screen">
//         <div className="flex-1 sm:px-10 mb-11">
//           <NavBar />
//           <div className="container mx-auto px-4 py-10 text-center">
//             <h1 className="text-2xl font-bold mb-4">No se puede modificar este evento.</h1>
//             <p className="text-red-600 font-semibold mb-2">
//               Solo puedes modificar eventos que estén <strong>por aprobar</strong>,{' '}
//               <strong>aprobados</strong> o <strong>en venta</strong>.
//             </p>
//             <p className="mb-6">
//               Estabas intentando modificar:{' '}
//               <span className="font-bold">
//                 {evento?.nombre || nombreFromState || 'Evento desconocido'}
//               </span>
//             </p>
//             <button
//               className="btn btn-info"
//               onClick={() => navigate('/mis-eventos-creados')}
//             >
//               Volver a mis eventos
//             </button>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // --- Render normal mientras evento todavía no está cargado ---
//   if (!evento) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <div className="flex-1 sm:px-10 mb-11">
//           <NavBar />
//           <div className="px-10 py-20 text-center">
//             <p className="text-lg">Cargando evento...</p>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="sm:px-10 mb-11 relative">
//         <NavBar />
//         <h1 className="px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8">
//           Modificar Evento
//         </h1>

//         <AclaracionModifEvento />

//         <form className="px-10">
//           <div className="form-control w-full mb-4">
//             <label className="label font-semibold text-lg">Nombre del evento:</label>
//             <input
//               type="text"
//               className="input input-bordered w-full max-w-lg"
//               value={nombreEvento}
//               onChange={(e) => setNombreEvento(e.target.value)}
//             />
//           </div>

//           <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

//           <InputGeneroMusical
//             onSeleccionGeneros={setGenerosSeleccionados}
//             valorInicial={evento?.genero || []}
//           />

//           <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

//           <InputDeArtistas
//             onSeleccionarArtistas={setArtistasSeleccionados}
//             artistasIniciales={artistasSeleccionados}
//           />

//           <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

//           <InputUbicacionEvento
//             onUbicacionChange={setUbicacionEvento}
//             ubicacionInicial={evento?.domicilio}
//           />

//           <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

//           <InputAfterOLbgt
//             onSeleccion={setAfterOLgbt}
//             valoresIniciales={{
//               isAfter: evento?.isAfter || false,
//               isLgbt: evento?.isLgbt || false
//             }}
//           />

//           <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

//           <InputDescripcionEvento
//             onDescripcionChange={setDescripcionEvento}
//             valorInicial={evento?.descripcion || ''}
//           />

//           <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

//           {fechaHoraEvento.length > 0 && (
//             <InputFechaHoraEvento
//               diasEvento={fechaHoraEvento.length}
//               onFechaHoraChange={setFechaHoraEventoCallback}
//               fechasIniciales={fechaHoraEvento}
//             />
//           )}

//           <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

//           <InputEntradasCantPrecio
//             diasEvento={fechaHoraEvento.length}
//             onEntradasChange={setEntradasPorDia}
//             entradasIniciales={entradasPorDia}
//             soloEditarPrecios={true}
//           />

//           <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

//           <InputConfigEntradas
//             diasEvento={fechaHoraEvento.length}
//             entradasPorDia={entradasPorDia}
//             onConfigEntradasChange={setConfigFechasVenta}
//             configInicial={configFechasVenta}
//           />

//           <hr className="my-4 w-1/2 border-gray-500" style={{ marginLeft: 0 }} />

//           <InputMultimedia
//             onMultimediaChange={setMultimedia}
//             onErrorChange={setErrorMultimedia}
//             imagenInicial={mediaImagenUrl}
//             videoInicial={mediaVideoUrl}
//             soundCloudInicial={evento?.soundCloud}
//           />

//           <div className="form-control mb-4 mt-6">
//             <label className="cursor-pointer label justify-start">
//               <input
//                 type="checkbox"
//                 className="checkbox checkbox-accent mr-2"
//                 checked={confirmacionModificacion}
//                 onChange={(e) => setConfirmacionModificacion(e.target.checked)}
//               />
//               <span className="label-text">Confirmo que deseo modificar el evento</span>
//             </label>
//           </div>

//           <button
//             type="button"
//             onClick={actualizarEvento}
//             className="btn btn-primary bg-blue-600 text-white rounded-xl"
//           >
//             Guardar cambios
//           </button>
//         </form>

//         {/* MODAL DE ÉXITO */}
//         {showSuccessModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white rounded-xl p-8 shadow-xl max-w-sm w-full text-center">
//               <h2 className="text-xl font-bold text-green-600 mb-4">
//                 Evento modificado exitosamente
//               </h2>
//               <p className="mb-6 text-gray-700">
//                 Tu evento se actualizó correctamente.
//               </p>
//               <button
//                 className="btn bg-blue-600 text-white rounded-xl w-full"
//                 onClick={() => {
//                   setShowSuccessModal(false);
//                   navigate('/mis-eventos-creados');
//                 }}
//               >
//                 Ok
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ModifDeEvento;