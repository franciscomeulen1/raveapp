// src/vistas/Comprar.js
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
import ModalReservaPendiente from '../components/componentsComprar/ModalReservaPendiente';
import ModalTiempoExpirado from '../components/componentsComprar/ModalTiempoExpirado';

export default function Comprar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Vienen desde Evento.js
  const {
    evento: eventoInicial,
    purchaseItems: purchaseItemsIniciales,
    subtotal: subtotalInicial,
  } = location.state;

  // Estado principal de la compra que se muestra en la vista
  const [evento, setEvento] = useState(eventoInicial);
  const [purchaseItems, setPurchaseItems] = useState(purchaseItemsIniciales || []);
  const [subtotal, setSubtotal] = useState(subtotalInicial || 0);

  const serviceFee = useMemo(() => Math.round(subtotal * 0.10), [subtotal]);
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  const [imagenEvento, setImagenEvento] = useState(null);

  // Usuario y formulario
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

  // Ubicación facturación
  const [selectedProvincia, setSelectedProvincia] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState(null);
  const [direccion, setDireccion] = useState('');

  // Timer 10 minutos
  const [remainingSec, setRemainingSec] = useState(600);
  const timerRef = useRef(null);

  // Pago / compra
  const [compraId, setCompraId] = useState(null);
  const [creandoPago, setCreandoPago] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // modal de confirmación de pago

  // Reserva pendiente (único idCompra)
  const [pendienteModalOpen, setPendienteModalOpen] = useState(false);
  const [reservaActiva, setReservaActiva] = useState(null);      // array del GET
  const [idCompraPendiente, setIdCompraPendiente] = useState(null);
  const [accionandoReservaPendiente, setAccionandoReservaPendiente] = useState(false);

  // Preview para el modal
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewPendiente, setPreviewPendiente] = useState(null);

  // NUEVO: modal al expirar y banderas
  const [expiredModalOpen, setExpiredModalOpen] = useState(false);
  const [cancelandoPorExpirar, setCancelandoPorExpirar] = useState(false);
  const expiroRef = useRef(false); // previene dobles ejecuciones al llegar a 0

  // Helpers
  const isEditable = (campo) => !usuarioData?.[campo];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Timer ----------
  useEffect(() => {
    timerRef.current = setInterval(() => setRemainingSec((s) => s - 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Al expirar el tiempo: cancelar y mostrar modal
  useEffect(() => {
    if (remainingSec > 0) return;
    if (expiroRef.current) return;
    expiroRef.current = true;

    // detener el timer
    if (timerRef.current) clearInterval(timerRef.current);

    // cerrar otros modales si estaban abiertos
    setModalVisible(false);
    setPendienteModalOpen(false);

    // cancelar si tenemos un idCompra (puede venir de la reserva actual o de la pendiente confirmada)
    const idAEliminar = compraId || idCompraPendiente;
    if (!idAEliminar) {
      setExpiredModalOpen(true);
      return;
    }

    (async () => {
      try {
        setCancelandoPorExpirar(true);
        await api.put('/Entrada/CancelarReserva', null, { params: { idCompra: idAEliminar } });
      } catch (err) {
        console.error('Error cancelando por expiración:', err?.response?.data || err?.message);
      } finally {
        setCancelandoPorExpirar(false);
        setExpiredModalOpen(true);
      }
    })();
  }, [remainingSec, compraId, idCompraPendiente]);

  // ---------- Cargar usuario + imagen del evento mostrado ----------
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

    const fetchImagenEvento = async (idEv) => {
      if (!idEv) return;
      try {
        const res = await api.get(`/Media`, { params: { idEntidadMedia: idEv } });
        const media = res.data.media?.find((m) => m.url);
        if (media?.url) setImagenEvento(media.url);
      } catch (err) {
        console.error('Error al obtener la imagen del evento:', err);
      }
    };

    fetchUsuario();
    fetchImagenEvento(evento?.id);
  }, [user, evento?.id]);

  // ---------- Helper: armar preview para el modal de reserva pendiente ----------
  const cargarPreviewReservaPendiente = async (arr) => {
    try {
      if (!arr || arr.length === 0) return;

      const idEventoPend = arr[0].idEvento;

      // Evento para nombre y fecha legible
      const resEv = await api.get(`/Evento/GetEventos`, { params: { IdEvento: idEventoPend } });
      const eventoData = resEv.data.eventos?.[0];
      const eventoNombre = eventoData?.nombre || 'Evento';

      const mapaFechaLegible = {};
      (eventoData?.fechas || []).forEach(f => {
        const legible = new Date(f.inicio).toLocaleDateString('es-AR');
        mapaFechaLegible[f.idFecha] = legible;
      });

      // Tipos
      const resTipos = await api.get(`/Entrada/GetTiposEntrada`);
      const tiposMap = {};
      (resTipos.data || []).forEach(t => { tiposMap[t.cdTipo] = t.dsTipo; });

      // Precios por fecha/tipo
      const idsFecha = [...new Set(arr.map(i => i.idFecha))];
      const preciosPorFecha = {};
      for (const idF of idsFecha) {
        const r = await api.get(`/Entrada/GetEntradasFecha`, { params: { IdFecha: idF } });
        const lista = Array.isArray(r.data) ? r.data : (r.data?.entradas || []);
        preciosPorFecha[idF] = {};
        lista.forEach(e => {
          const cd = e.tipo?.cdTipo ?? e.cdTipo;
          preciosPorFecha[idF][cd] = e.precio;
        });
      }

      // Líneas y subtotal
      let subtotalLocal = 0;
      const items = arr.map(it => {
        const cantidad = Number(it.cantidad || 0);
        const cdTipo = Number(it.tipoEntrada);
        const precio = preciosPorFecha?.[it.idFecha]?.[cdTipo] ?? 0;
        const dsTipo = tiposMap[cdTipo] || 'Sin nombre';
        const fechaLegible = mapaFechaLegible[it.idFecha] || '';
        const linea = `${cantidad} x ${dsTipo} para el día ${fechaLegible} a $${precio} c/u`;
        subtotalLocal += cantidad * precio;
        return { linea };
      });

      setPreviewPendiente({
        eventoNombre,
        items,
        subtotal: subtotalLocal,
      });
    } catch (err) {
      console.error('No se pudo armar el preview de la reserva pendiente:', err?.response?.data || err?.message);
      setPreviewPendiente(null);
    }
  };

  // ---------- Check de reserva activa ANTES de reservar la compra actual ----------
  const [readyToReserveCurrent, setReadyToReserveCurrent] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkReservaActiva = async () => {
      try {
        const res = await api.get('/Entrada/GetReservaActiva', { params: { idUsuario: user.id } });
        const arr = Array.isArray(res.data) ? res.data : [];

        if (arr.length === 0) {
          // No hay reserva activa
          setReadyToReserveCurrent(true);
          return;
        }

        // Único idCompra en todo el array
        const idCompraUnique = arr[0]?.idCompra || null;
        setReservaActiva(arr);
        setIdCompraPendiente(idCompraUnique);

        // Abrir modal y cargar preview
        setLoadingPreview(true);
        setPendienteModalOpen(true);
        await cargarPreviewReservaPendiente(arr);
        setLoadingPreview(false);
      } catch (err) {
        if (err?.response?.status === 404) {
          setReadyToReserveCurrent(true);
        } else {
          console.error('Error consultando reserva activa:', err?.response?.data || err?.message);
          setReadyToReserveCurrent(true);
        }
      }
    };

    checkReservaActiva();
  }, [user]);

  // ---------- Reservar entradas de la compra ACTUAL (si corresponde) ----------
  useEffect(() => {
    if (!user || !readyToReserveCurrent) return;
    if (!Array.isArray(purchaseItems) || purchaseItems.length === 0) return;

    const byFecha = new Map();
    purchaseItems.forEach((it) => {
      const idFecha = it.idFecha;
      const tipoEntrada = Number(it.cdTipoEntrada);
      const cantidad = Number(it.cantidad);
      if (!idFecha || !Number.isFinite(tipoEntrada) || !Number.isFinite(cantidad) || cantidad <= 0) return;
      const arr = byFecha.get(idFecha) || [];
      arr.push({ tipoEntrada, cantidad });
      byFecha.set(idFecha, arr);
    });

    if (byFecha.size === 0) return;

    (async () => {
      for (const [idFecha, entradas] of byFecha.entries()) {
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
          const nuevoIdCompra = res?.data?.idCompra || res?.data?.id || res?.data;
          if (nuevoIdCompra) setCompraId(prev => prev || nuevoIdCompra);
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
  }, [user, readyToReserveCurrent, purchaseItems]);

  // ---------- Modal reserva pendiente: Confirmar (usar la pendiente) ----------
  const handleConfirmarReservaPendiente = async () => {
    if (!reservaActiva || reservaActiva.length === 0 || !idCompraPendiente) {
      setPendienteModalOpen(false);
      setReadyToReserveCurrent(true);
      return;
    }

    setAccionandoReservaPendiente(true);
    try {
      // Mismo idEvento para todas las filas
      const idEventoPend = reservaActiva[0].idEvento;

      // Evento completo para setear en la vista
      const resEv = await api.get(`/Evento/GetEventos`, { params: { IdEvento: idEventoPend } });
      const eventoData = resEv.data.eventos?.[0];
      if (!eventoData) throw new Error('No se pudo obtener el evento de la reserva pendiente');

      const eventoProcesado = {
        id: eventoData.idEvento,
        nombreEvento: eventoData.nombre,
        dias: (eventoData.fechas || []).map(fecha => ({
          idFecha: fecha.idFecha,
          fecha: new Date(fecha.inicio).toLocaleDateString('es-AR'),
          horaInicio: new Date(fecha.inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
          horaFin: new Date(fecha.fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
          estado: fecha.estado
        })),
        generos: eventoData.genero || [],
        artistas: eventoData.artistas || [],
        lgbt: eventoData.isLgbt,
        after: eventoData.isAfter,
        provincia: eventoData.domicilio?.provincia?.nombre,
        municipio: eventoData.domicilio?.municipio?.nombre,
        localidad: eventoData.domicilio?.localidad?.nombre,
        direccion: eventoData.domicilio?.direccion,
        descripcion: eventoData.descripcion,
        soundcloud: eventoData.soundCloud,
        imagen: null,
        youtube: null
      };

      // Media (imagen)
      try {
        const resMedia = await api.get(`/Media`, { params: { idEntidadMedia: eventoData.idEvento } });
        const mediaArr = resMedia.data.media || [];
        const img = mediaArr.find(m => m.url && !m.mdVideo);
        const vid = mediaArr.find(m => m.mdVideo && !m.url);
        eventoProcesado.imagen = img?.url || null;
        eventoProcesado.youtube = vid?.mdVideo || null;
        setImagenEvento(img?.url || null);
      } catch {}

      // Tipos y precios para armar purchaseItems con importes correctos
      const resTipos = await api.get(`/Entrada/GetTiposEntrada`);
      const tiposMap = {};
      (resTipos.data || []).forEach(t => { tiposMap[t.cdTipo] = t.dsTipo; });

      const idsFechaInvolucradas = [...new Set(reservaActiva.map(i => i.idFecha))];
      const preciosPorFecha = {};
      for (const idF of idsFechaInvolucradas) {
        const r = await api.get(`/Entrada/GetEntradasFecha`, { params: { IdFecha: idF } });
        const lista = Array.isArray(r.data) ? r.data : (r.data?.entradas || []);
        preciosPorFecha[idF] = {};
        lista.forEach(e => {
          const cd = e.tipo?.cdTipo ?? e.cdTipo;
          preciosPorFecha[idF][cd] = e.precio;
        });
      }

      const purchasePend = reservaActiva.map(it => {
        const cdTipoEntrada = Number(it.tipoEntrada);
        const idFecha = it.idFecha;
        const cantidad = Number(it.cantidad || 0);
        const precio = preciosPorFecha?.[idFecha]?.[cdTipoEntrada] ?? 0;
        const dsTipo = tiposMap[cdTipoEntrada] || 'Sin nombre';
        const dia = eventoProcesado.dias.find(d => d.idFecha === idFecha)?.fecha || '';
        const itemSubtotal = precio * cantidad;
        return {
          idFecha,
          cdTipoEntrada,
          cantidad,
          dia,
          dsTipo,
          tipo: dsTipo,
          precio,
          itemSubtotal
        };
      });

      const nuevoSubtotal = purchasePend.reduce((acc, it) => acc + (it.itemSubtotal || 0), 0);

      // Setear vista con la PENDIENTE y su idCompra
      setEvento(eventoProcesado);
      setPurchaseItems(purchasePend);
      setSubtotal(nuevoSubtotal);
      setCompraId(idCompraPendiente);

      // Cerrar modal e impedir reservar la compra actual
      setPendienteModalOpen(false);
      setReadyToReserveCurrent(false);
    } catch (err) {
      console.error('Error armando resumen de reserva pendiente:', err?.response?.data || err?.message);
      // Si falla, permitir seguir con la compra actual
      setPendienteModalOpen(false);
      setReadyToReserveCurrent(true);
    } finally {
      setAccionandoReservaPendiente(false);
    }
  };

  // ---------- Modal reserva pendiente: Cancelar (cancelar la reserva y seguir con la actual) ----------
  const handleContinuarCompraActual = async () => {
    if (!idCompraPendiente) {
      setPendienteModalOpen(false);
      setReadyToReserveCurrent(true);
      return;
    }
    setAccionandoReservaPendiente(true);
    try {
      await api.put('/Entrada/CancelarReserva', null, { params: { idCompra: idCompraPendiente } });
    } catch (err) {
      console.error('Error cancelando reserva pendiente:', err?.response?.data || err?.message);
      // Igual seguimos
    } finally {
      setPendienteModalOpen(false);
      setReservaActiva(null);
      setIdCompraPendiente(null);
      setReadyToReserveCurrent(true); // ahora sí, reservar la compra actual
      setAccionandoReservaPendiente(false);
    }
  };

  // ---------- Submit datos + modal para ir a MP ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentErrors = {};
    const { telefono, numeroId, birthdate, tipoId } = form;

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

    // Completar datos faltantes del usuario si fuera necesario
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
        subtotal,
        cargoServicio: serviceFee,
        backUrl: 'https://raveapp.com.ar/gracias-por-tu-compra',
      };

      const res = await api.post('/Pago/CrearPago', payload);
      const url = res?.data?.url;

      if (!url) {
        console.error('La respuesta de /Pago/CrearPago no trajo url:', res?.data);
        alert('No se pudo iniciar el pago. Intentá nuevamente en unos instantes.');
        setCreandoPago(false);
        return;
      }

      window.location.assign(url);
    } catch (err) {
      console.error('Error al crear pago:', err?.response?.data || err?.message);
      alert('Ocurrió un error al crear el pago. Intentá nuevamente.');
      setCreandoPago(false);
    }
  };

  // ---------- Navegar de vuelta al evento tras expirar ----------
  const handleOkExpirado = () => {
    navigate(`/evento/${evento?.id || eventoInicial?.id}`);
  };

  return (
    <div>
      <div className="sm:px-10 mb-11">
        <NavBar />

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
            <p className="text-sm">
              ** Al hacer clic en comprar, se te mostrará una confirmación antes de redirigirte a MercadoPago.
            </p>
          </div>

          <div className="col-span-1">
            <button type="submit" className="btn btn-secondary rounded-xl">Comprar</button>
          </div>
        </form>
      </div>

      <Footer />

      {/* Modal confirmación antes de ir a MP */}
      <ModalRedireccion
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmIrAPago}
        confirmDisabled={creandoPago}
      />

      {/* Modal de reserva pendiente con preview */}
      <ModalReservaPendiente
        open={pendienteModalOpen}
        onConfirm={handleConfirmarReservaPendiente}
        onCancel={handleContinuarCompraActual}
        disabled={accionandoReservaPendiente}
        loadingPreview={loadingPreview}
        preview={previewPendiente}
      />

      {/* NUEVO: Modal de tiempo expirado */}
      <ModalTiempoExpirado
        open={expiredModalOpen}
        onOk={handleOkExpirado}
        disabled={cancelandoPorExpirar}
      />
    </div>
  );
}