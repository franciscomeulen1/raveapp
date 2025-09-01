import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../componenteapi/api';

import ResumenCompra from '../components/componentsComprar/ResumenCompra';
import DatosUsuario from '../components/componentsComprar/DatosUsuario';
import DomicilioFacturacion from '../components/componentsComprar/DomicilioFacturacion';
import TyCPrivacidad from '../components/componentsComprar/TyCPrivacidad';
import ModalRedireccion from '../components/componentsComprar/ModalRedireccion';
import CountdownBar from '../components/componentsComprar/CountdownBar';

export default function Comprar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { evento, purchaseItems, subtotal } = location.state;

  const serviceFee = useMemo(() => Math.round(subtotal * 0.10), [subtotal]);
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  const [imagenEvento, setImagenEvento] = useState(null);

  const [usuarioData, setUsuarioData] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    tipoId: 'DNI',
    numeroId: '',
    birthdate: '',
  });

  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  // Ubicación
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState(null);
  const [direccion, setDireccion] = useState('');

  // ---------- TIMER 10 minutos ----------
  const [remainingSec, setRemainingSec] = useState(600); // 10 min = 600s
  const timerRef = useRef(null);

  const [compraId, setCompraId] = useState(null);
  const [creandoPago, setCreandoPago] = useState(false); // opcional: para deshabilitar el botón mientras llama al backend


  // Si abrís el modal para ir a MP, podés pausar el timer si lo preferís:
  // eslint-disable-next-line
  const pauseTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  // eslint-disable-next-line
  const resumeTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setRemainingSec((s) => s - 1);
      }, 1000);
    }
  };

  useEffect(() => {
    // Arranca el timer
    timerRef.current = setInterval(() => {
      setRemainingSec((s) => s - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (remainingSec <= 0) {
      // Tiempo agotado -> volver a la página del evento
      if (timerRef.current) clearInterval(timerRef.current);
      navigate(`/evento/${evento?.id}`);
    }
  }, [remainingSec, navigate, evento?.id]);

  // ---------- Helpers ----------
  const isEditable = (campo) => !usuarioData?.[campo];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Efectos de datos ----------
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUsuario = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/Usuario/GetUsuario`, { params: { IdUsuario: user.id } });
        const data = res.data.usuarios?.[0];
        if (data) {
          setUsuarioData(data);
          setForm((prev) => ({
            ...prev,
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            email: data.correo || '',
            telefono: data.telefono || '',
            numeroId: data.dni || '',
            birthdate: data.dtNacimiento ? data.dtNacimiento.slice(0, 10) : '',
          }));
          setSelectedProvincia({
            nombre: data.domicilio?.provincia?.nombre || '',
            id: data.domicilio?.provincia?.codigo || '',
          });
          setSelectedMunicipio({
            nombre: data.domicilio?.municipio?.nombre || '',
            id: data.domicilio?.municipio?.codigo || '',
          });
          setSelectedLocalidad({
            nombre: data.domicilio?.localidad?.nombre || '',
            id: data.domicilio?.localidad?.codigo || '',
          });
          setDireccion(data.domicilio?.direccion || '');
        }
      } catch (err) {
        console.error('Error al obtener datos del usuario:', err);
      }
    };

    const fetchImagenEvento = async () => {
      if (!evento?.id) return;
      try {
        const res = await api.get(`/Media`, { params: { idEntidadMedia: evento.id } });
        const media = res.data.media?.find((m) => m.url);
        if (media?.url) setImagenEvento(media.url);
      } catch (err) {
        console.error('Error al obtener la imagen del evento:', err);
      }
    };

    fetchUsuario();
    fetchImagenEvento();
  }, [user, evento?.id]);

  // ---------- Reservar entradas al montar ----------
  useEffect(() => {
    if (!user || !Array.isArray(purchaseItems) || purchaseItems.length === 0) return;

    const byFecha = new Map(); // idFecha -> [{ tipoEntrada, cantidad }]

    purchaseItems.forEach((it, idx) => {
      const idFecha = it.idFecha;
      const tipoEntrada = Number(it.cdTipoEntrada);
      const cantidad = Number(it.cantidad);

      if (!idFecha) {
        console.warn('Item sin idFecha, omitido:', { idx, it });
        return;
      }
      if (!Number.isFinite(tipoEntrada)) {
        console.warn('cdTipoEntrada inválido, omitido:', { idx, it });
        return;
      }
      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        console.warn('Cantidad inválida, omitido:', { idx, it });
        return;
      }
      const arr = byFecha.get(idFecha) || [];
      arr.push({ tipoEntrada, cantidad });
      byFecha.set(idFecha, arr);
    });

    if (byFecha.size === 0) {
      console.warn('No hay reservas válidas para enviar.');
      return;
    }

    (async () => {
      for (const [idFecha, entradas] of byFecha.entries()) {
        // Compactar por tipoEntrada
        const compactado = Object.values(
          entradas.reduce((acc, e) => {
            const k = String(e.tipoEntrada);
            acc[k] = acc[k] ? { ...acc[k], cantidad: acc[k].cantidad + e.cantidad } : e;
            return acc;
          }, {})
        );

        const payload = { entradas: compactado, idUsuario: user.id, idFecha };
        try {
          const res = await api.put('/Entrada/ReservarEntradas', payload);
          console.log('[Reserva OK]', { idFecha, status: res?.status, payload, data: res?.data });

          // ⬇️ Guarda el idCompra devuelto por el backend
          const nuevoIdCompra = res?.data?.idCompra || res?.data?.id || res?.data;
          if (nuevoIdCompra) {
            setCompraId(prev => prev || nuevoIdCompra);
            // Si tu backend devuelve SIEMPRE el mismo idCompra para todas las fechas,
            // este prev || nuevoIdCompra te asegura quedarte con el primero válido.
          } else {
            console.warn('No vino idCompra en la respuesta de ReservarEntradas');
          }

        } catch (err) {
          console.error('[Reserva ERROR]', {
            idFecha,
            payload,
            status: err?.response?.status,
            data: err?.response?.data,
            message: err?.message,
          });
        }
      }
    })();
  }, [user, purchaseItems]);

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentErrors = {};
    const { telefono, numeroId, birthdate, tipoId } = form;

    // Validaciones
    const phoneRegex = /^[0-9]{8,}$/;
    if (!phoneRegex.test(telefono)) currentErrors.telefono = 'El teléfono debe tener al menos 8 dígitos.';

    const birth = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    const isUnderage = m < 0 || (m === 0 && today.getDate() < birth.getDate());
    if (isNaN(birth.getTime()) || age < 18 || (age === 18 && isUnderage)) {
      currentErrors.birthdate = 'Debés tener al menos 18 años.';
    }

    const dniRegex = /^[0-9]{7,9}$/;
    const passRegex = /^[A-Za-z0-9]{6,12}$/;
    if (tipoId === 'DNI' && !dniRegex.test(numeroId)) {
      currentErrors.numeroId = 'DNI inválido.';
    } else if (tipoId === 'Pasaporte' && !passRegex.test(numeroId)) {
      currentErrors.numeroId = 'Pasaporte inválido.';
    }

    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    // ¿Hay datos nuevos para completar?
    const camposACompletar = [
      !usuarioData?.telefono && form.telefono,
      !usuarioData?.dni && form.numeroId,
      !usuarioData?.dtNacimiento && form.birthdate,
      !usuarioData?.domicilio?.provincia?.nombre && selectedProvincia?.nombre,
      !usuarioData?.domicilio?.municipio?.nombre && selectedMunicipio?.nombre,
      !usuarioData?.domicilio?.localidad?.nombre && selectedLocalidad?.nombre,
      !usuarioData?.domicilio?.direccion && direccion,
    ];
    const hayCamposNuevos = camposACompletar.some(Boolean);

    if (hayCamposNuevos) {
      // Regla CABA
      let provinciaPayload = { nombre: selectedProvincia?.nombre || '', codigo: selectedProvincia?.id || '' };
      let municipioPayload = { nombre: selectedMunicipio?.nombre || '', codigo: selectedMunicipio?.id || '' };
      let localidadPayload = { nombre: selectedLocalidad?.nombre || '', codigo: selectedLocalidad?.id || '' };
      if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
        provinciaPayload = municipioPayload = localidadPayload = { nombre: 'Ciudad Autónoma de Buenos Aires', codigo: '02' };
      }

      const payload = {
        idUsuario: user.id,
        nombre: usuarioData?.nombre || '',
        apellido: usuarioData?.apellido || '',
        correo: usuarioData?.correo || '',
        dni: usuarioData?.dni || form.numeroId,
        telefono: usuarioData?.telefono || form.telefono,
        bio: usuarioData?.bio || '',
        cbu: usuarioData?.cbu || '',
        dtNacimiento: usuarioData?.dtNacimiento || new Date(form.birthdate).toISOString(),
        cdRoles: usuarioData?.roles?.map((r) => r.cdRol) || [],
        domicilio: {
          provincia: provinciaPayload,
          municipio: municipioPayload,
          localidad: localidadPayload,
          direccion: usuarioData?.domicilio?.direccion || direccion,
          latitud: 0,
          longitud: 0,
        },
        socials: usuarioData?.socials
          ? {
            idSocial: usuarioData.socials.idSocial || '',
            mdInstagram: usuarioData.socials.mdInstagram || '',
            mdSpotify: usuarioData.socials.mdSpotify || '',
            mdSoundcloud: usuarioData.socials.mdSoundcloud || '',
          }
          : { idSocial: '', mdInstagram: '', mdSpotify: '', mdSoundcloud: '' },
      };

      try {
        await api.put('/Usuario/UpdateUsuario', payload);
      } catch (err) {
        console.error('Error al actualizar usuario:', err);
      }
    }

    // Mostrar modal (si querés pausar el timer acá, descomenta)
    // pauseTimer();
    setModalVisible(true);
  };

  const handleConfirmIrAPago = async () => {
    if (!compraId) {
      alert('No se pudo obtener el id de la compra. Por favor, volvé a intentar.');
      return;
    }

    try {
      setCreandoPago(true);

      const payload = {
        idCompra: compraId,
        subtotal: subtotal,                 // viene del state/location
        cargoServicio: serviceFee,          // tu 10% redondeado
        backUrl: 'localhost:3000/gracias-por-tu-compra', // tal como pediste
      };

      const res = await api.post('/Pago/CrearPago', payload);
      const url = res?.data?.url;

      if (!url) {
        console.error('La respuesta de /Pago/CrearPago no trajo url:', res?.data);
        alert('No se pudo iniciar el pago. Intentá nuevamente en unos instantes.');
        setCreandoPago(false);
        return;
      }

      // Redirección en la MISMA pestaña
      window.location.assign(url);

    } catch (err) {
      console.error('Error al crear pago:', err?.response?.data || err?.message);
      alert('Ocurrió un error al crear el pago. Intentá nuevamente.');
      setCreandoPago(false);
    }
  };


  return (
    <div>
      <div className="sm:px-10 mb-11">
        <NavBar />

        {/* Barra/contador opcional */}
        <CountdownBar remainingSec={remainingSec} />

        <h1 className="mx-10 sm:px-10 mt-2 mb-5 text-2xl font-bold">Resumen de tu compra:</h1>

        <div className="mx-6 sm:px-10">
          <ResumenCompra
            evento={evento}
            purchaseItems={purchaseItems}
            subtotal={subtotal}
            serviceFee={serviceFee}
            total={total}
            imagenEvento={imagenEvento}
          />
        </div>

        <h2 className="mx-6 sm:px-10 mt-4 mb-3 text-2xl font-bold">Tus datos:</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-16">
          <DatosUsuario
            form={form}
            errors={errors}
            isEditable={isEditable}
            onChange={handleChange}
          />

          <DomicilioFacturacion
            selectedProvincia={selectedProvincia}
            selectedMunicipio={selectedMunicipio}
            selectedLocalidad={selectedLocalidad}
            direccion={direccion}
            domicilioBloqueado={!!usuarioData?.domicilio?.direccion}
            onUbicacionChange={({ provincia, municipio, localidad }) => {
              setSelectedProvincia(provincia);
              setSelectedMunicipio(municipio);
              setSelectedLocalidad(localidad);
            }}
            onDireccionChange={setDireccion}
          />

          <TyCPrivacidad />

          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <p className="text-sm">** Al hacer clic en comprar, se te mostrará una confirmación antes de redirigirte a MercadoPago.</p>
          </div>

          <div className="col-span-1">
            <button type="submit" className="btn btn-secondary rounded-xl">Comprar</button>
          </div>
        </form>
      </div>

      <Footer />

      <ModalRedireccion
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
          // resumeTimer(); // si pausaste antes
          // aquí normalmente harías la redirección a MP
        }}
        // ⬇️ Nuevo: cuando el usuario toca "Ok"
        onConfirm={handleConfirmIrAPago}
        confirmDisabled={creandoPago} // opcional: deshabilitar botón mientras llama al backend
      />
    </div>
  );
}


// import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import api from '../componenteapi/api';

// import ResumenCompra from '../components/componentsComprar/ResumenCompra';
// import DatosUsuario from '../components/componentsComprar/DatosUsuario';
// import DomicilioFacturacion from '../components/componentsComprar/DomicilioFacturacion';
// import TyCPrivacidad from '../components/componentsComprar/TyCPrivacidad';
// import ModalRedireccion from '../components/componentsComprar/ModalRedireccion';
// import CountdownBar from '../components/componentsComprar/CountdownBar';

// export default function Comprar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const { evento, purchaseItems, subtotal } = location.state;

//   const serviceFee = useMemo(() => Math.round(subtotal * 0.10), [subtotal]);
//   const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

//   const [imagenEvento, setImagenEvento] = useState(null);

//   const [usuarioData, setUsuarioData] = useState(null);
//   const [form, setForm] = useState({
//     nombre: '',
//     apellido: '',
//     email: '',
//     telefono: '',
//     tipoId: 'DNI',
//     numeroId: '',
//     birthdate: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [modalVisible, setModalVisible] = useState(false);

//   // Ubicación
//   const [selectedProvincia, setSelectedProvincia] = useState(null);
//   const [selectedMunicipio, setSelectedMunicipio] = useState(null);
//   const [selectedLocalidad, setSelectedLocalidad] = useState(null);
//   const [direccion, setDireccion] = useState('');

//   // ---------- TIMER 10 minutos ----------
//   const [remainingSec, setRemainingSec] = useState(600); // 10 min = 600s
//   const timerRef = useRef(null);

//   // Si abrís el modal para ir a MP, podés pausar el timer si lo preferís:
//   // eslint-disable-next-line
//   const pauseTimer = () => {
//     if (timerRef.current) clearInterval(timerRef.current);
//   };
//   // eslint-disable-next-line
//   const resumeTimer = () => {
//     if (!timerRef.current) {
//       timerRef.current = setInterval(() => {
//         setRemainingSec((s) => s - 1);
//       }, 1000);
//     }
//   };

//   useEffect(() => {
//     // Arranca el timer
//     timerRef.current = setInterval(() => {
//       setRemainingSec((s) => s - 1);
//     }, 1000);

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     if (remainingSec <= 0) {
//       // Tiempo agotado -> volver a la página del evento
//       if (timerRef.current) clearInterval(timerRef.current);
//       navigate(`/evento/${evento?.id}`);
//     }
//   }, [remainingSec, navigate, evento?.id]);

//   // ---------- Helpers ----------
//   const isEditable = (campo) => !usuarioData?.[campo];
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // ---------- Efectos de datos ----------
//   useEffect(() => {
//     window.scrollTo(0, 0);

//     const fetchUsuario = async () => {
//       if (!user) return;
//       try {
//         const res = await api.get(`/Usuario/GetUsuario`, { params: { IdUsuario: user.id } });
//         const data = res.data.usuarios?.[0];
//         if (data) {
//           setUsuarioData(data);
//           setForm((prev) => ({
//             ...prev,
//             nombre: data.nombre || '',
//             apellido: data.apellido || '',
//             email: data.correo || '',
//             telefono: data.telefono || '',
//             numeroId: data.dni || '',
//             birthdate: data.dtNacimiento ? data.dtNacimiento.slice(0, 10) : '',
//           }));
//           setSelectedProvincia({
//             nombre: data.domicilio?.provincia?.nombre || '',
//             id: data.domicilio?.provincia?.codigo || '',
//           });
//           setSelectedMunicipio({
//             nombre: data.domicilio?.municipio?.nombre || '',
//             id: data.domicilio?.municipio?.codigo || '',
//           });
//           setSelectedLocalidad({
//             nombre: data.domicilio?.localidad?.nombre || '',
//             id: data.domicilio?.localidad?.codigo || '',
//           });
//           setDireccion(data.domicilio?.direccion || '');
//         }
//       } catch (err) {
//         console.error('Error al obtener datos del usuario:', err);
//       }
//     };

//     const fetchImagenEvento = async () => {
//       if (!evento?.id) return;
//       try {
//         const res = await api.get(`/Media`, { params: { idEntidadMedia: evento.id } });
//         const media = res.data.media?.find((m) => m.url);
//         if (media?.url) setImagenEvento(media.url);
//       } catch (err) {
//         console.error('Error al obtener la imagen del evento:', err);
//       }
//     };

//     fetchUsuario();
//     fetchImagenEvento();
//   }, [user, evento?.id]);

//   // ---------- Reservar entradas al montar ----------
//   useEffect(() => {
//     if (!user || !Array.isArray(purchaseItems) || purchaseItems.length === 0) return;

//     const byFecha = new Map(); // idFecha -> [{ tipoEntrada, cantidad }]

//     purchaseItems.forEach((it, idx) => {
//       const idFecha = it.idFecha;
//       const tipoEntrada = Number(it.cdTipoEntrada);
//       const cantidad = Number(it.cantidad);

//       if (!idFecha) {
//         console.warn('Item sin idFecha, omitido:', { idx, it });
//         return;
//       }
//       if (!Number.isFinite(tipoEntrada)) {
//         console.warn('cdTipoEntrada inválido, omitido:', { idx, it });
//         return;
//       }
//       if (!Number.isFinite(cantidad) || cantidad <= 0) {
//         console.warn('Cantidad inválida, omitido:', { idx, it });
//         return;
//       }
//       const arr = byFecha.get(idFecha) || [];
//       arr.push({ tipoEntrada, cantidad });
//       byFecha.set(idFecha, arr);
//     });

//     if (byFecha.size === 0) {
//       console.warn('No hay reservas válidas para enviar.');
//       return;
//     }

//     (async () => {
//       for (const [idFecha, entradas] of byFecha.entries()) {
//         // Compactar por tipoEntrada (acumula cantidades del mismo tipo)
//         const compactado = Object.values(
//           entradas.reduce((acc, e) => {
//             const k = String(e.tipoEntrada);
//             acc[k] = acc[k] ? { ...acc[k], cantidad: acc[k].cantidad + e.cantidad } : e;
//             return acc;
//           }, {})
//         );

//         const payload = { entradas: compactado, idUsuario: user.id, idFecha };
//         try {
//           const res = await api.put('/Entrada/ReservarEntradas', payload);
//           console.log('[Reserva OK]', { idFecha, status: res?.status, payload });
//         } catch (err) {
//           console.error('[Reserva ERROR]', {
//             idFecha,
//             payload,
//             status: err?.response?.status,
//             data: err?.response?.data,
//             message: err?.message,
//           });
//         }
//       }
//     })();
//     // Nota: si tu backend soporta "cancelar reserva" en unmount/timeout, acá podrías dispararlo.
//   }, [user, purchaseItems]);

//   // ---------- Submit ----------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const currentErrors = {};
//     const { telefono, numeroId, birthdate, tipoId } = form;

//     // Validaciones
//     const phoneRegex = /^[0-9]{8,}$/;
//     if (!phoneRegex.test(telefono)) currentErrors.telefono = 'El teléfono debe tener al menos 8 dígitos.';

//     const birth = new Date(birthdate);
//     const today = new Date();
//     const age = today.getFullYear() - birth.getFullYear();
//     const m = today.getMonth() - birth.getMonth();
//     const isUnderage = m < 0 || (m === 0 && today.getDate() < birth.getDate());
//     if (isNaN(birth.getTime()) || age < 18 || (age === 18 && isUnderage)) {
//       currentErrors.birthdate = 'Debés tener al menos 18 años.';
//     }

//     const dniRegex = /^[0-9]{7,9}$/;
//     const passRegex = /^[A-Za-z0-9]{6,12}$/;
//     if (tipoId === 'DNI' && !dniRegex.test(numeroId)) {
//       currentErrors.numeroId = 'DNI inválido.';
//     } else if (tipoId === 'Pasaporte' && !passRegex.test(numeroId)) {
//       currentErrors.numeroId = 'Pasaporte inválido.';
//     }

//     setErrors(currentErrors);
//     if (Object.keys(currentErrors).length > 0) return;

//     // ¿Hay datos nuevos para completar?
//     const camposACompletar = [
//       !usuarioData?.telefono && form.telefono,
//       !usuarioData?.dni && form.numeroId,
//       !usuarioData?.dtNacimiento && form.birthdate,
//       !usuarioData?.domicilio?.provincia?.nombre && selectedProvincia?.nombre,
//       !usuarioData?.domicilio?.municipio?.nombre && selectedMunicipio?.nombre,
//       !usuarioData?.domicilio?.localidad?.nombre && selectedLocalidad?.nombre,
//       !usuarioData?.domicilio?.direccion && direccion,
//     ];
//     const hayCamposNuevos = camposACompletar.some(Boolean);

//     if (hayCamposNuevos) {
//       // Regla CABA
//       let provinciaPayload = { nombre: selectedProvincia?.nombre || '', codigo: selectedProvincia?.id || '' };
//       let municipioPayload = { nombre: selectedMunicipio?.nombre || '', codigo: selectedMunicipio?.id || '' };
//       let localidadPayload = { nombre: selectedLocalidad?.nombre || '', codigo: selectedLocalidad?.id || '' };
//       if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
//         provinciaPayload = municipioPayload = localidadPayload = { nombre: 'Ciudad Autónoma de Buenos Aires', codigo: '02' };
//       }

//       const payload = {
//         idUsuario: user.id,
//         nombre: usuarioData?.nombre || '',
//         apellido: usuarioData?.apellido || '',
//         correo: usuarioData?.correo || '',
//         dni: usuarioData?.dni || form.numeroId,
//         telefono: usuarioData?.telefono || form.telefono,
//         bio: usuarioData?.bio || '',
//         cbu: usuarioData?.cbu || '',
//         dtNacimiento: usuarioData?.dtNacimiento || new Date(form.birthdate).toISOString(),
//         cdRoles: usuarioData?.roles?.map((r) => r.cdRol) || [],
//         domicilio: {
//           provincia: provinciaPayload,
//           municipio: municipioPayload,
//           localidad: localidadPayload,
//           direccion: usuarioData?.domicilio?.direccion || direccion,
//           latitud: 0,
//           longitud: 0,
//         },
//         socials: usuarioData?.socials
//           ? {
//             idSocial: usuarioData.socials.idSocial || '',
//             mdInstagram: usuarioData.socials.mdInstagram || '',
//             mdSpotify: usuarioData.socials.mdSpotify || '',
//             mdSoundcloud: usuarioData.socials.mdSoundcloud || '',
//           }
//           : { idSocial: '', mdInstagram: '', mdSpotify: '', mdSoundcloud: '' },
//       };

//       try {
//         await api.put('/Usuario/UpdateUsuario', payload);
//       } catch (err) {
//         console.error('Error al actualizar usuario:', err);
//       }
//     }

//     // Mostrar modal (si querés pausar el timer acá, descomenta)
//     // pauseTimer();
//     setModalVisible(true);
//   };

//   return (
//     <div>
//       <div className="sm:px-10 mb-11">
//         <NavBar />

//         {/* Barra/contador opcional */}
//         <CountdownBar remainingSec={remainingSec} />

//         <h1 className="mx-10 sm:px-10 mt-2 mb-5 text-2xl font-bold">Resumen de tu compra:</h1>

//         <div className="mx-6 sm:px-10">
//           <ResumenCompra
//             evento={evento}
//             purchaseItems={purchaseItems}
//             subtotal={subtotal}
//             serviceFee={serviceFee}
//             total={total}
//             imagenEvento={imagenEvento}
//           />
//         </div>

//         <h2 className="mx-6 sm:px-10 mt-4 mb-3 text-2xl font-bold">Tus datos:</h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-16">
//           <DatosUsuario
//             form={form}
//             errors={errors}
//             isEditable={isEditable}
//             onChange={handleChange}
//           />

//           <DomicilioFacturacion
//             selectedProvincia={selectedProvincia}
//             selectedMunicipio={selectedMunicipio}
//             selectedLocalidad={selectedLocalidad}
//             direccion={direccion}
//             domicilioBloqueado={!!usuarioData?.domicilio?.direccion}
//             onUbicacionChange={({ provincia, municipio, localidad }) => {
//               setSelectedProvincia(provincia);
//               setSelectedMunicipio(municipio);
//               setSelectedLocalidad(localidad);
//             }}
//             onDireccionChange={setDireccion}
//           />

//           <TyCPrivacidad />

//           <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//             <p className="text-sm">** Al hacer clic en comprar, se te mostrará una confirmación antes de redirigirte a MercadoPago.</p>
//           </div>

//           <div className="col-span-1">
//             <button type="submit" className="btn btn-secondary rounded-xl">Comprar</button>
//           </div>
//         </form>
//       </div>

//       <Footer />

//       <ModalRedireccion
//         open={modalVisible}
//         onClose={() => {
//           setModalVisible(false);
//           // resumeTimer(); // si pausaste antes
//           // aquí normalmente harías la redirección a MP
//         }}
//       />
//     </div>
//   );
// }