import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import CheckTyC from '../components/componentsCrearEvento/CheckTyC';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

function CrearEvento() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombreEvento, setNombreEvento] = useState('');
  const [diasEvento, setDiasEvento] = useState(1);
  const [fechaHoraEvento, setFechaHoraEvento] = useState({ inicio: '', fin: '' });
  const [artistasSeleccionados, setArtistasSeleccionados] = useState([]);
  const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
  const [recurrenteInfo, setRecurrenteInfo] = useState({
    esRecurrente: false,
    idFiesta: null,
    nombreFiestaNueva: null,
    valido: true
  });
  const [ubicacionEvento, setUbicacionEvento] = useState(null);
  const [afterOLgbt, setAfterOLgbt] = useState({ isAfter: false, isLgbt: false });
  const [descripcionEvento, setDescripcionEvento] = useState('');
  //Para ver si el usuario ingreso EB, y en ese caso mostrar luego la config de las EB.
  const [hayEarlyBirdsPorDia, setHayEarlyBirdsPorDia] = useState([]);
  const [configFechasVenta, setConfigFechasVenta] = useState([]);
  const [entradasPorDia, setEntradasPorDia] = useState([]);
  const [multimedia, setMultimedia] = useState({ soundCloud: '', videoUrl: '', file: '' });
  const [errorMultimedia, setErrorMultimedia] = useState(false);
  const [aceptaTyC, setAceptaTyC] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fechaAnteriorRef = useRef();

  const handleFechaHoraEventoChange = (nuevasFechas) => {
    const actualStr = JSON.stringify(nuevasFechas);
    const anteriorStr = JSON.stringify(fechaAnteriorRef.current);

    if (actualStr !== anteriorStr) {
      fechaAnteriorRef.current = nuevasFechas;
      setFechaHoraEvento(nuevasFechas);
    }
  };

  const handleEntradasPorDiaChange = useCallback((datos) => {
    setHayEarlyBirdsPorDia(datos);
  }, []);

  const handleEntradasChange = useCallback((datos) => {
    setEntradasPorDia(datos);
  }, []);

  // Inicializa estructuras internas cuando cambia la cantidad de días del evento
  useEffect(() => {
    const nuevasEntradas = Array.from({ length: diasEvento }, () => ({
      generales: 0,
      generalesEarly: 0,
      vip: 0,
      vipEarly: 0,
      generalesPrice: '',
      generalesEarlyPrice: '',
      vipPrice: '',
      vipEarlyPrice: '',
    }));
    setEntradasPorDia(nuevasEntradas);

    const nuevasConfigs = Array.from({ length: diasEvento }, () => ({
      inicioVenta: '',
      finVentaGeneralVip: ''
    }));
    setConfigFechasVenta(nuevasConfigs);

    const inicialHayEB = Array.from({ length: diasEvento }, () => false);
    setHayEarlyBirdsPorDia(inicialHayEB);
  }, [diasEvento]);

  const validarFormulario = () => {
    if (!nombreEvento.trim()) {
      alert('Debes ingresar un nombre para el evento.');
      return false;
    }
    if (
      !ubicacionEvento ||
      !ubicacionEvento.provincia ||
      !ubicacionEvento.municipio ||
      !ubicacionEvento.localidad ||
      !ubicacionEvento.direccion.trim()
    ) {
      alert('Debes seleccionar provincia, municipio, localidad y completar la dirección del evento.');
      return false;
    }
    if (!generosSeleccionados.length) {
      alert('Debes seleccionar al menos un género musical.');
      return false;
    }
    if (!artistasSeleccionados.length) {
      alert('Debes seleccionar al menos un artista.');
      return false;
    }
    if (!descripcionEvento.trim()) {
      alert('Debes ingresar una descripción para el evento.');
      return false;
    }
    if (!fechaHoraEvento || fechaHoraEvento.length < diasEvento) {
      alert('Debes ingresar fecha y hora para todos los días del evento.');
      return false;
    }
    if (recurrenteInfo.esRecurrente && !recurrenteInfo.valido) {
      alert('Debes seleccionar o ingresar un nombre de fiesta recurrente.');
      return false;
    }
    if (errorMultimedia) {
      alert('El link de música ingresado debe ser un enlace válido de SoundCloud.');
      return false;
    }
    if (!multimedia.file) {
      alert('Debes subir una imagen válida (jpg, jpeg o png menor a 2MB).');
      return false;
    }
    if (!aceptaTyC) {
      alert('Debes aceptar los términos y condiciones para continuar.');
      return false;
    }
    return true;
  };

  const crearArtistasSiEsNecesario = async () => {
    const artistasNuevos = artistasSeleccionados.filter(a => a.esNuevo);
    const artistasExistentes = artistasSeleccionados.filter(a => !a.esNuevo);
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
      idsNuevos.push(response.data.idArtista);
    }

    return [...artistasExistentes.map(a => a.id), ...idsNuevos];
  };

  const resolverIdFiesta = async () => {
    if (!recurrenteInfo.esRecurrente) return null;

    if (recurrenteInfo.idFiesta) return recurrenteInfo.idFiesta;

    if (recurrenteInfo.nombreFiestaNueva && user?.id) {
      const response = await api.post('/Fiesta/CrearFiesta', {
        idUsuario: user.id,
        nombre: recurrenteInfo.nombreFiestaNueva,
        isActivo: true
      });
      return response.data.idFiesta;
    }

    return null;
  };

  const armarPayloadEvento = (idsArtistas, idFiestaFinal) => {
    const inicioEvento = fechaHoraEvento[0]?.inicio || '';
    const finEvento = fechaHoraEvento[diasEvento - 1]?.fin || '';

    const fechas = fechaHoraEvento.map((dia, index) => ({
      fechaInicio: dia.inicio,
      fechaFin: dia.fin,
      fechaIncioVenta: configFechasVenta[index]?.inicioVenta || '',
      fechaFinVenta: configFechasVenta[index]?.finVentaGeneralVip || '',
      estado: 1
    }));

    return {
      idUsuario: user.id,
      idArtistas: idsArtistas,
      domicilio: ubicacionEvento,
      nombre: nombreEvento,
      descripcion: descripcionEvento,
      genero: generosSeleccionados,
      isAfter: afterOLgbt.isAfter,
      isLgbt: afterOLgbt.isLgbt,
      inicioVenta: fechas[0]?.fechaIncioVenta || '',
      finVenta: fechas[fechas.length - 1]?.fechaFinVenta || '',
      inicioEvento,
      finEvento,
      estado: 0,
      fechas,
      idFiesta: idFiestaFinal,
      soundCloud: multimedia.soundCloud?.trim() || null
    };
  };

  const crearEntradasPorFecha = async (idEventoCreado) => {
    const responseGet = await api.get(`/Evento/GetEventos?IdEvento=${idEventoCreado}`);
    const fechasDelEvento = responseGet.data.eventos[0]?.fechas || [];

    if (!fechasDelEvento.length) {
      throw new Error('No se encontraron fechas en el evento creado.');
    }

    for (let i = 0; i < fechasDelEvento.length; i++) {
      const idFecha = fechasDelEvento[i].idFecha;
      const entradasDia = entradasPorDia[i];
      if (!entradasDia) continue;

      const entradasAEnviar = [];

      if (entradasDia.generales > 0) {
        entradasAEnviar.push({
          idFecha, tipo: 0, estado: 0,
          precio: parseInt(entradasDia.generalesPrice, 10),
          cantidad: entradasDia.generales
        });
      }
      if (entradasDia.generalesEarly > 0 && entradasDia.generalesEarlyPrice !== "") {
        entradasAEnviar.push({
          idFecha, tipo: 1, estado: 0,
          precio: parseInt(entradasDia.generalesEarlyPrice, 10),
          cantidad: entradasDia.generalesEarly
        });
      }
      if (entradasDia.vip > 0) {
        entradasAEnviar.push({
          idFecha, tipo: 2, estado: 0,
          precio: parseInt(entradasDia.vipPrice, 10),
          cantidad: entradasDia.vip
        });
      }
      if (entradasDia.vipEarly > 0 && entradasDia.vipEarlyPrice !== "") {
        entradasAEnviar.push({
          idFecha, tipo: 3, estado: 0,
          precio: parseInt(entradasDia.vipEarlyPrice, 10),
          cantidad: entradasDia.vipEarly
        });
      }

      for (const entrada of entradasAEnviar) {
        await api.post('/Entrada/CrearEntradas', entrada);
      }
    }
  };

  const actualizarRolAOrganizadorSiEsNecesario = async () => {
    // Este if evalúa si debemos evitar actualizar el rol del usuario
    // "Si el usuario no existe, o no es 'Usuario', o ya es 'Organizador', entonces no hagas nada".
    if (
      !user?.id ||
      !user.roles.some(r => r.cdRol === 0) ||
      user.roles.some(r => r.cdRol === 2)
    ) return;

    const response = await api.get(`/Usuario/GetUsuario?IdUsuario=${user.id}`);
    const usuario = response.data.usuarios?.[0];
    if (!usuario) return;

    const nuevosRoles = [...new Set(usuario.roles.map(r => r.cdRol).concat(2))];

    const body = {
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      cbu: usuario.cbu,
      dni: usuario.dni,
      telefono: usuario.telefono,
      nombreFantasia: usuario.nombreFantasia,
      bio: usuario.bio,
      dtNacimiento: usuario.dtNacimiento,
      domicilio: {
        direccion: usuario.domicilio.direccion,
        latitud: usuario.domicilio.latitud,
        longitud: usuario.domicilio.longitud,
        provincia: usuario.domicilio.provincia,
        municipio: usuario.domicilio.municipio,
        localidad: usuario.domicilio.localidad,
      },
      socials: usuario.socials,
      cdRoles: nuevosRoles,
    };

    console.log('Body enviado', body);
    await api.put('/Usuario/UpdateUsuario', body);

    const rolesActualizados = [...user.roles, { cdRol: 2, dsRol: 'Organizador' }];
    const usuarioActualizado = { ...user, roles: rolesActualizados };

    setUser(usuarioActualizado);
    localStorage.setItem('user', JSON.stringify(usuarioActualizado));

    console.log('Rol de organizador asignado al usuario y reflejado en el contexto.');
  };

  const handleCrearEvento = async () => {
    try {
      if (!validarFormulario()) return;

      const idsArtistas = await crearArtistasSiEsNecesario();
      const idFiestaFinal = await resolverIdFiesta();
      const payloadEvento = armarPayloadEvento(idsArtistas, idFiestaFinal);

      console.log('Payload que se enviará:', payloadEvento);

      const responseEvento = await api.post('/Evento/CrearEvento', payloadEvento);
      const idEventoCreado = responseEvento.data.idEvento;

      console.log('Evento creado correctamente. ID:', idEventoCreado);

      await crearEntradasPorFecha(idEventoCreado);
      await actualizarRolAOrganizadorSiEsNecesario();

      setShowSuccessModal(true);

      try {
        if (multimedia.videoUrl) {
          const formDataVideo = new FormData();
          formDataVideo.append('IdEntidadMedia', idEventoCreado);
          formDataVideo.append('File', null);
          formDataVideo.append('Video', multimedia.videoUrl);

          await api.post('/Media', formDataVideo, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } catch (error) {
        console.error('Error al subir video:', error);
      }

      try {
        if (multimedia.file) {
          const formData = new FormData();
          formData.append('IdEntidadMedia', idEventoCreado);
          formData.append('File', multimedia.file);

          await api.post('/Media', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } catch (error) {
        console.error('Error al subir imagen:', error);
      }

    } catch (error) {
      console.error('Error al crear evento:', error);
      alert('Ocurrió un error al crear el evento. Revisa la consola para más detalles.');
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
            <input
              type='text'
              placeholder="Nombre del evento"
              className="input input-bordered w-full max-w-lg"
              value={nombreEvento}
              onChange={(e) => setNombreEvento(e.target.value)}
            />
          </div>

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputEsEventoRecurrente onSeleccionRecurrente={setRecurrenteInfo} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputCantDiasEvento onDiasChange={setDiasEvento} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputGeneroMusical onSeleccionGeneros={setGenerosSeleccionados} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <div className='mb-5'><InputDeArtistas onSeleccionarArtistas={setArtistasSeleccionados} /></div>

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <h3 className='text-xl font-bold'>Ubicación del evento:</h3>
          <div className='mb-6'><InputUbicacionEvento onUbicacionChange={setUbicacionEvento} /></div>

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputAfterOLbgt onSeleccion={setAfterOLgbt} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputDescripcionEvento onDescripcionChange={setDescripcionEvento} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputFechaHoraEvento diasEvento={diasEvento} onFechaHoraChange={handleFechaHoraEventoChange} />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputEntradasCantPrecio
            diasEvento={diasEvento}
            onEntradasPorDiaChange={handleEntradasPorDiaChange}
            onEntradasChange={handleEntradasChange}
            entradasIniciales={entradasPorDia}
          />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputConfigEntradas
            diasEvento={diasEvento}
            entradasPorDia={hayEarlyBirdsPorDia}
            onConfigEntradasChange={setConfigFechasVenta}
            configInicial={configFechasVenta}
          />

          <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

          <InputMultimedia
            onMultimediaChange={setMultimedia}
            onErrorChange={setErrorMultimedia}
          />

          <CheckTyC onChange={setAceptaTyC} />

          <button type='button' onClick={handleCrearEvento} className='btn btn-primary bg-purple-600 text-white rounded-xl'>Crear Evento</button>
        </form>
      </div>
      <Footer />
      
      {/* MODAL DE ÉXITO */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">¡Evento creado exitosamente!</h2>
            <p className="mb-6">Tu evento y las entradas se han creado correctamente.</p>
            <button
              onClick={() => navigate('/mis-eventos-creados')}
              className="btn btn-primary bg-purple-600 text-white rounded-xl"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrearEvento;

// import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import InputDeArtistas from '../components/componentsCrearEvento/InputDeArtistas';
// import InputUbicacionEvento from '../components/componentsCrearEvento/InputUbicacionEvento';
// import InputFechaHoraEvento from '../components/componentsCrearEvento/InputFechaHoraEvento';
// import InputEntradasCantPrecio from '../components/componentsCrearEvento/InputEntradasCantPrecio';
// import InputMultimedia from '../components/componentsCrearEvento/InputMultimedia';
// import InputConfigEntradas from '../components/componentsCrearEvento/InputConfigEntradas';
// import InputGeneroMusical from '../components/componentsCrearEvento/InputGeneroMusical';
// import InputCantDiasEvento from '../components/componentsCrearEvento/InputCantDiasEvento';
// import InputEsEventoRecurrente from '../components/componentsCrearEvento/InputEsEventoRecurrente';
// import InputDescripcionEvento from '../components/componentsCrearEvento/InputDescripcionEvento';
// import InputAfterOLbgt from '../components/componentsCrearEvento/InputAfterOLgbt';
// import CheckTyC from '../components/componentsCrearEvento/CheckTyC';
// import api from '../componenteapi/api';
// import { AuthContext } from '../context/AuthContext';

// function CrearEvento() {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const { user, setUser } = useContext(AuthContext);

//   const [nombreEvento, setNombreEvento] = useState('');
//   const [diasEvento, setDiasEvento] = useState(1);
//   const [fechaHoraEvento, setFechaHoraEvento] = useState({ inicio: '', fin: '' });
//   const [artistasSeleccionados, setArtistasSeleccionados] = useState([]);
//   const [generosSeleccionados, setGenerosSeleccionados] = useState([]);
//   const [recurrenteInfo, setRecurrenteInfo] = useState({
//     esRecurrente: false,
//     idFiesta: null,
//     nombreFiestaNueva: null,
//     valido: true
//   });
//   const [ubicacionEvento, setUbicacionEvento] = useState(null);
//   const [afterOLgbt, setAfterOLgbt] = useState({ isAfter: false, isLgbt: false });
//   const [descripcionEvento, setDescripcionEvento] = useState('');
//   //Para ver si el usuario ingreso EB, y en ese caso mostrar luego la config de las EB.
//   const [hayEarlyBirdsPorDia, setHayEarlyBirdsPorDia] = useState([]);
//   const [configFechasVenta, setConfigFechasVenta] = useState([]);
//   const [entradasPorDia, setEntradasPorDia] = useState([]);
//   const [multimedia, setMultimedia] = useState({ soundCloud: '', videoUrl: '', file: '' });
//   const [errorMultimedia, setErrorMultimedia] = useState(false);
//   const [aceptaTyC, setAceptaTyC] = useState(false);

//   const fechaAnteriorRef = useRef();

//   const handleFechaHoraEventoChange = (nuevasFechas) => {
//     const actualStr = JSON.stringify(nuevasFechas);
//     const anteriorStr = JSON.stringify(fechaAnteriorRef.current);

//     if (actualStr !== anteriorStr) {
//       fechaAnteriorRef.current = nuevasFechas;
//       setFechaHoraEvento(nuevasFechas);
//     }
//   };

//   const handleEntradasPorDiaChange = useCallback((datos) => {
//     setHayEarlyBirdsPorDia(datos);
//   }, []);

//   const handleEntradasChange = useCallback((datos) => {
//     setEntradasPorDia(datos);
//   }, []);

//   // Inicializa estructuras internas cuando cambia la cantidad de días del evento
//   useEffect(() => {
//     const nuevasEntradas = Array.from({ length: diasEvento }, () => ({
//       generales: 0,
//       generalesEarly: 0,
//       vip: 0,
//       vipEarly: 0,
//       generalesPrice: '',
//       generalesEarlyPrice: '',
//       vipPrice: '',
//       vipEarlyPrice: '',
//     }));
//     setEntradasPorDia(nuevasEntradas);

//     const nuevasConfigs = Array.from({ length: diasEvento }, () => ({
//       inicioVenta: '',
//       finVentaGeneralVip: ''
//     }));
//     setConfigFechasVenta(nuevasConfigs);

//     const inicialHayEB = Array.from({ length: diasEvento }, () => false);
//     setHayEarlyBirdsPorDia(inicialHayEB);
//   }, [diasEvento]);

//   const validarFormulario = () => {
//     if (!nombreEvento.trim()) {
//       alert('Debes ingresar un nombre para el evento.');
//       return false;
//     }
//     if (
//       !ubicacionEvento ||
//       !ubicacionEvento.provincia ||
//       !ubicacionEvento.municipio ||
//       !ubicacionEvento.localidad ||
//       !ubicacionEvento.direccion.trim()
//     ) {
//       alert('Debes seleccionar provincia, municipio, localidad y completar la dirección del evento.');
//       return false;
//     }
//     if (!generosSeleccionados.length) {
//       alert('Debes seleccionar al menos un género musical.');
//       return false;
//     }
//     if (!artistasSeleccionados.length) {
//       alert('Debes seleccionar al menos un artista.');
//       return false;
//     }
//     if (!descripcionEvento.trim()) {
//       alert('Debes ingresar una descripción para el evento.');
//       return false;
//     }
//     if (!fechaHoraEvento || fechaHoraEvento.length < diasEvento) {
//       alert('Debes ingresar fecha y hora para todos los días del evento.');
//       return false;
//     }
//     if (recurrenteInfo.esRecurrente && !recurrenteInfo.valido) {
//       alert('Debes seleccionar o ingresar un nombre de fiesta recurrente.');
//       return false;
//     }
//     if (errorMultimedia) {
//       alert('El link de música ingresado debe ser un enlace válido de SoundCloud.');
//       return false;
//     }
//     if (!multimedia.file) {
//       alert('Debes subir una imagen válida (jpg, jpeg o png menor a 2MB).');
//       return false;
//     }
//     if (!aceptaTyC) {
//       alert('Debes aceptar los términos y condiciones para continuar.');
//       return false;
//     }
//     return true;
//   };

//   const crearArtistasSiEsNecesario = async () => {
//     const artistasNuevos = artistasSeleccionados.filter(a => a.esNuevo);
//     const artistasExistentes = artistasSeleccionados.filter(a => !a.esNuevo);
//     const idsNuevos = [];

//     for (const nuevo of artistasNuevos) {
//       const response = await api.post('/Artista/CreateArtista', {
//         nombre: nuevo.nombre,
//         bio: '',
//         socials: {
//           idSocial: '',
//           mdInstagram: '',
//           mdSpotify: '',
//           mdSoundcloud: ''
//         },
//         isActivo: false
//       });
//       idsNuevos.push(response.data.idArtista);
//     }

//     return [...artistasExistentes.map(a => a.id), ...idsNuevos];
//   };

//   const resolverIdFiesta = async () => {
//     if (!recurrenteInfo.esRecurrente) return null;

//     if (recurrenteInfo.idFiesta) return recurrenteInfo.idFiesta;

//     if (recurrenteInfo.nombreFiestaNueva && user?.id) {
//       const response = await api.post('/Fiesta/CrearFiesta', {
//         idUsuario: user.id,
//         nombre: recurrenteInfo.nombreFiestaNueva,
//         isActivo: true
//       });
//       return response.data.idFiesta;
//     }

//     return null;
//   };

//   const armarPayloadEvento = (idsArtistas, idFiestaFinal) => {
//     const inicioEvento = fechaHoraEvento[0]?.inicio || '';
//     const finEvento = fechaHoraEvento[diasEvento - 1]?.fin || '';

//     const fechas = fechaHoraEvento.map((dia, index) => ({
//       fechaInicio: dia.inicio,
//       fechaFin: dia.fin,
//       fechaIncioVenta: configFechasVenta[index]?.inicioVenta || '',
//       fechaFinVenta: configFechasVenta[index]?.finVentaGeneralVip || '',
//       estado: 1
//     }));

//     return {
//       idUsuario: user.id,
//       idArtistas: idsArtistas,
//       domicilio: ubicacionEvento,
//       nombre: nombreEvento,
//       descripcion: descripcionEvento,
//       genero: generosSeleccionados,
//       isAfter: afterOLgbt.isAfter,
//       isLgbt: afterOLgbt.isLgbt,
//       inicioVenta: fechas[0]?.fechaIncioVenta || '',
//       finVenta: fechas[fechas.length - 1]?.fechaFinVenta || '',
//       inicioEvento,
//       finEvento,
//       estado: 0,
//       fechas,
//       idFiesta: idFiestaFinal,
//       soundCloud: multimedia.soundCloud?.trim() || null
//     };
//   };

//   const crearEntradasPorFecha = async (idEventoCreado) => {
//     const responseGet = await api.get(`/Evento/GetEventos?IdEvento=${idEventoCreado}`);
//     const fechasDelEvento = responseGet.data.eventos[0]?.fechas || [];

//     if (!fechasDelEvento.length) {
//       throw new Error('No se encontraron fechas en el evento creado.');
//     }

//     for (let i = 0; i < fechasDelEvento.length; i++) {
//       const idFecha = fechasDelEvento[i].idFecha;
//       const entradasDia = entradasPorDia[i];
//       if (!entradasDia) continue;

//       const entradasAEnviar = [];

//       if (entradasDia.generales > 0) {
//         entradasAEnviar.push({
//           idFecha, tipo: 0, estado: 0,
//           precio: parseInt(entradasDia.generalesPrice, 10),
//           cantidad: entradasDia.generales
//         });
//       }
//       if (entradasDia.generalesEarly > 0 && entradasDia.generalesEarlyPrice !== "") {
//         entradasAEnviar.push({
//           idFecha, tipo: 1, estado: 0,
//           precio: parseInt(entradasDia.generalesEarlyPrice, 10),
//           cantidad: entradasDia.generalesEarly
//         });
//       }
//       if (entradasDia.vip > 0) {
//         entradasAEnviar.push({
//           idFecha, tipo: 2, estado: 0,
//           precio: parseInt(entradasDia.vipPrice, 10),
//           cantidad: entradasDia.vip
//         });
//       }
//       if (entradasDia.vipEarly > 0 && entradasDia.vipEarlyPrice !== "") {
//         entradasAEnviar.push({
//           idFecha, tipo: 3, estado: 0,
//           precio: parseInt(entradasDia.vipEarlyPrice, 10),
//           cantidad: entradasDia.vipEarly
//         });
//       }

//       for (const entrada of entradasAEnviar) {
//         await api.post('/Entrada/CrearEntradas', entrada);
//       }
//     }
//   };

//   const actualizarRolAOrganizadorSiEsNecesario = async () => {
//     // Este if evalúa si debemos evitar actualizar el rol del usuario
//     // "Si el usuario no existe, o no es 'Usuario', o ya es 'Organizador', entonces no hagas nada".
//     if (
//       !user?.id ||
//       !user.roles.some(r => r.cdRol === 0) ||
//       user.roles.some(r => r.cdRol === 2)
//     ) return;

//     const response = await api.get(`/Usuario/GetUsuario?IdUsuario=${user.id}`);
//     const usuario = response.data.usuarios?.[0];
//     if (!usuario) return;

//     const nuevosRoles = [...new Set(usuario.roles.map(r => r.cdRol).concat(2))];

//     const body = {
//       idUsuario: usuario.idUsuario,
//       nombre: usuario.nombre,
//       apellido: usuario.apellido,
//       correo: usuario.correo,
//       cbu: usuario.cbu,
//       dni: usuario.dni,
//       telefono: usuario.telefono,
//       nombreFantasia: usuario.nombreFantasia,
//       bio: usuario.bio,
//       dtNacimiento: usuario.dtNacimiento,
//       domicilio: {
//         direccion: usuario.domicilio.direccion,
//         latitud: usuario.domicilio.latitud,
//         longitud: usuario.domicilio.longitud,
//         provincia: usuario.domicilio.provincia,
//         municipio: usuario.domicilio.municipio,
//         localidad: usuario.domicilio.localidad,
//       },
//       socials: usuario.socials,
//       cdRoles: nuevosRoles,
//     };

//     console.log('Body enviado', body);
//     await api.put('/Usuario/UpdateUsuario', body);

//     const rolesActualizados = [...user.roles, { cdRol: 2, dsRol: 'Organizador' }];
//     const usuarioActualizado = { ...user, roles: rolesActualizados };

//     setUser(usuarioActualizado);
//     localStorage.setItem('user', JSON.stringify(usuarioActualizado));

//     console.log('Rol de organizador asignado al usuario y reflejado en el contexto.');
//   };

//   const handleCrearEvento = async () => {
//     try {
//       if (!validarFormulario()) return;

//       const idsArtistas = await crearArtistasSiEsNecesario();
//       const idFiestaFinal = await resolverIdFiesta();
//       const payloadEvento = armarPayloadEvento(idsArtistas, idFiestaFinal);

//       console.log('Payload que se enviará:', payloadEvento);

//       const responseEvento = await api.post('/Evento/CrearEvento', payloadEvento);
//       const idEventoCreado = responseEvento.data.idEvento;

//       console.log('Evento creado correctamente. ID:', idEventoCreado);

//       await crearEntradasPorFecha(idEventoCreado);
//       await actualizarRolAOrganizadorSiEsNecesario();

//       alert('Evento y entradas creados correctamente.');

//       try {
//         if (multimedia.videoUrl) {
//           const formDataVideo = new FormData();
//           formDataVideo.append('IdEntidadMedia', idEventoCreado);
//           formDataVideo.append('File', null);
//           formDataVideo.append('Video', multimedia.videoUrl);

//           await api.post('/Media', formDataVideo, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//           });
//         }
//       } catch (error) {
//         console.error('Error al subir video:', error);
//       }

//       try {
//         if (multimedia.file) {
//           const formData = new FormData();
//           formData.append('IdEntidadMedia', idEventoCreado);
//           formData.append('File', multimedia.file);

//           await api.post('/Media', formData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//           });
//         }
//       } catch (error) {
//         console.error('Error al subir imagen:', error);
//       }

//     } catch (error) {
//       console.error('Error al crear evento:', error);
//       alert('Ocurrió un error al crear el evento. Revisa la consola para más detalles.');
//     }
//   };

//   return (
//     <div>
//       <div className="sm:px-10 mb-11">
//         <NavBar />
//         <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Crear Evento</h1>

//         <form className='px-10'>
//           <h2 className='text-xl font-bold'>Datos del evento:</h2>
//           <div className='form-control w-full mb-4'>
//             <label className="label">
//               <span className="label-text font-semibold text-lg">Nombre del evento:</span>
//             </label>
//             <input
//               type='text'
//               placeholder="Nombre del evento"
//               className="input input-bordered w-full max-w-lg"
//               value={nombreEvento}
//               onChange={(e) => setNombreEvento(e.target.value)}
//             />
//           </div>

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <InputEsEventoRecurrente onSeleccionRecurrente={setRecurrenteInfo} />

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <InputCantDiasEvento onDiasChange={setDiasEvento} />

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <InputGeneroMusical onSeleccionGeneros={setGenerosSeleccionados} />

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <div className='mb-5'><InputDeArtistas onSeleccionarArtistas={setArtistasSeleccionados} /></div>

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <h3 className='text-xl font-bold'>Ubicación del evento:</h3>
//           <div className='mb-6'><InputUbicacionEvento onUbicacionChange={setUbicacionEvento} /></div>

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <InputAfterOLbgt onSeleccion={setAfterOLgbt} />

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <InputDescripcionEvento onDescripcionChange={setDescripcionEvento} />

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <InputFechaHoraEvento diasEvento={diasEvento} onFechaHoraChange={handleFechaHoraEventoChange} />

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <InputEntradasCantPrecio
//             diasEvento={diasEvento}
//             onEntradasPorDiaChange={handleEntradasPorDiaChange}
//             onEntradasChange={handleEntradasChange}
//             entradasIniciales={entradasPorDia}
//           />

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <InputConfigEntradas
//             diasEvento={diasEvento}
//             entradasPorDia={hayEarlyBirdsPorDia}
//             onConfigEntradasChange={setConfigFechasVenta}
//             configInicial={configFechasVenta}
//           />

//           <hr className='my-4 w-1/2 border-gray-500' style={{ marginLeft: 0 }} />

//           <InputMultimedia
//             onMultimediaChange={setMultimedia}
//             onErrorChange={setErrorMultimedia}
//           />

//           <CheckTyC onChange={setAceptaTyC} />

//           <button type='button' onClick={handleCrearEvento} className='btn btn-primary bg-purple-600 text-white rounded-xl'>Crear Evento</button>
//         </form>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default CrearEvento;