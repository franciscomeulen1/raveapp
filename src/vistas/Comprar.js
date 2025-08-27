import React, { useState, useEffect, useContext, useMemo } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../componenteapi/api';

import ResumenCompra from '../components/componentsComprar/ResumenCompra';
import DatosUsuario from '../components/componentsComprar/DatosUsuario';
import DomicilioFacturacion from '../components/componentsComprar/DomicilioFacturacion';
import TyCPrivacidad from '../components/componentsComprar/TyCPrivacidad';
import ModalRedireccion from '../components/componentsComprar/ModalRedireccion';

export default function Comprar() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { evento, purchaseItems, subtotal } = location.state;

  const serviceFee = useMemo(() => Math.round(subtotal * 0.10), [subtotal]);
  const total = useMemo(() => subtotal + serviceFee, [subtotal, serviceFee]);

  // ---------- Estado principal ----------
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

  // ---------- Helpers ----------
  const isEditable = (campo) => !usuarioData?.[campo];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Efectos ----------
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
        console.log('Usuario actualizado con domicilio');
      } catch (err) {
        console.error('Error al actualizar usuario:', err);
      }
    }

    // Mostrar modal (confirmación de redirección a MP)
    setModalVisible(true);
  };

  return (
    <div>
      <div className="sm:px-10 mb-11">
        <NavBar />

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

          {/* Aviso redirección */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <p className="text-sm">** Al hacer clic en comprar, se te mostrará una confirmación antes de redirigirte a MercadoPago.</p>
          </div>

          <div className="col-span-1">
            <button type="submit" className="btn btn-secondary rounded-xl">Comprar</button>
          </div>
        </form>
      </div>

      <Footer />

      <ModalRedireccion open={modalVisible} onClose={() => setModalVisible(false)} />
    </div>
  );
}



// import React, { useState, useEffect, useContext } from 'react';
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';
// import { useLocation } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import api from '../componenteapi/api';
// import InputUbicacionUsuario from '../components/componentsMiPerfil/InputUbicacionUsuario';

// export default function Comprar() {
//   const location = useLocation();
//   const { user } = useContext(AuthContext);
//   // const { evento, purchaseItems, subtotal, serviceFee, total } = location.state;
//   const { evento, purchaseItems, subtotal } = location.state;

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

//   const serviceFee = Math.round(subtotal * 0.10);
//   const total = subtotal + serviceFee;

//   const [selectedProvincia, setSelectedProvincia] = useState(null);
//   const [selectedMunicipio, setSelectedMunicipio] = useState(null);
//   const [selectedLocalidad, setSelectedLocalidad] = useState(null);
//   const [direccion, setDireccion] = useState('');


//   useEffect(() => {
//     window.scrollTo(0, 0);

//     const fetchUsuario = async () => {
//       if (!user) return;
//       try {
//         const res = await api.get(`/Usuario/GetUsuario`, {
//           params: { IdUsuario: user.id },
//         });
//         const data = res.data.usuarios?.[0];
//         if (data) {
//           setUsuarioData(data);
//           setForm(prev => ({
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
//             id: data.domicilio?.provincia?.codigo || ''
//           });
//           setSelectedMunicipio({
//             nombre: data.domicilio?.municipio?.nombre || '',
//             id: data.domicilio?.municipio?.codigo || ''
//           });
//           setSelectedLocalidad({
//             nombre: data.domicilio?.localidad?.nombre || '',
//             id: data.domicilio?.localidad?.codigo || ''
//           });
//           setDireccion(data.domicilio?.direccion || '');
//         }
//       } catch (err) {
//         console.error('Error al obtener datos del usuario:', err);
//       }
//     };

//     fetchUsuario();

//     const fetchImagenEvento = async () => {
//       if (!evento?.id) return;
//       try {
//         const res = await api.get(`/Media`, { params: { idEntidadMedia: evento.id } });
//         const media = res.data.media?.find(m => m.url); // Filtra la imagen (no video)
//         if (media?.url) {
//           setImagenEvento(media.url);
//         }
//       } catch (err) {
//         console.error('Error al obtener la imagen del evento:', err);
//       }
//     };

//     fetchImagenEvento();

//   }, [user, evento.id]);

//   const isEditable = campo => !usuarioData?.[campo];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   const currentErrors = {};
//   const { telefono, numeroId, birthdate } = form;

//   // Validaciones
//   const phoneRegex = /^[0-9]{8,}$/;
//   if (!phoneRegex.test(telefono)) {
//     currentErrors.telefono = 'El teléfono debe tener al menos 8 dígitos.';
//   }

//   const birth = new Date(birthdate);
//   const today = new Date();
//   const age = today.getFullYear() - birth.getFullYear();
//   const m = today.getMonth() - birth.getMonth();
//   const isUnderage = m < 0 || (m === 0 && today.getDate() < birth.getDate());
//   if (isNaN(birth.getTime()) || age < 18 || (age === 18 && isUnderage)) {
//     currentErrors.birthdate = 'Debés tener al menos 18 años.';
//   }

//   const dniRegex = /^[0-9]{7,9}$/;
//   const passRegex = /^[A-Za-z0-9]{6,12}$/;
//   if (form.tipoId === 'DNI' && !dniRegex.test(numeroId)) {
//     currentErrors.numeroId = 'DNI inválido.';
//   } else if (form.tipoId === 'Pasaporte' && !passRegex.test(numeroId)) {
//     currentErrors.numeroId = 'Pasaporte inválido.';
//   }

//   setErrors(currentErrors);
//   if (Object.keys(currentErrors).length > 0) return;

//   // Evaluar si se ingresaron nuevos datos
//   const camposACompletar = [
//     !usuarioData.telefono && form.telefono,
//     !usuarioData.dni && form.numeroId,
//     !usuarioData.dtNacimiento && form.birthdate,
//     !usuarioData.domicilio?.provincia?.nombre && selectedProvincia?.nombre,
//     !usuarioData.domicilio?.municipio?.nombre && selectedMunicipio?.nombre,
//     !usuarioData.domicilio?.localidad?.nombre && selectedLocalidad?.nombre,
//     !usuarioData.domicilio?.direccion && direccion,
//   ];

//   const hayCamposNuevos = camposACompletar.some(Boolean);

//   if (hayCamposNuevos) {
//     // Preparar domicilio
//     let provinciaPayload = { nombre: selectedProvincia?.nombre || '', codigo: selectedProvincia?.id || '' };
//     let municipioPayload = { nombre: selectedMunicipio?.nombre || '', codigo: selectedMunicipio?.id || '' };
//     let localidadPayload = { nombre: selectedLocalidad?.nombre || '', codigo: selectedLocalidad?.id || '' };

//     if (selectedProvincia?.nombre === 'Ciudad Autónoma de Buenos Aires') {
//       provinciaPayload = municipioPayload = localidadPayload = {
//         nombre: 'Ciudad Autónoma de Buenos Aires',
//         codigo: '02'
//       };
//     }

//     const payload = {
//       idUsuario: user.id,
//       nombre: usuarioData.nombre || '',
//       apellido: usuarioData.apellido || '',
//       correo: usuarioData.correo || '',
//       dni: usuarioData.dni || form.numeroId,
//       telefono: usuarioData.telefono || form.telefono,
//       bio: usuarioData.bio || '',
//       cbu: usuarioData.cbu || '',
//       dtNacimiento: usuarioData.dtNacimiento || new Date(form.birthdate).toISOString(),
//       cdRoles: usuarioData.roles?.map(r => r.cdRol) || [],
//       domicilio: {
//         provincia: provinciaPayload,
//         municipio: municipioPayload,
//         localidad: localidadPayload,
//         direccion: usuarioData.domicilio?.direccion || direccion,
//         latitud: 0,
//         longitud: 0,
//       },
//       socials: usuarioData.socials ? {
//         idSocial: usuarioData.socials.idSocial || '',
//         mdInstagram: usuarioData.socials.mdInstagram || '',
//         mdSpotify: usuarioData.socials.mdSpotify || '',
//         mdSoundcloud: usuarioData.socials.mdSoundcloud || ''
//       } : {
//         idSocial: '',
//         mdInstagram: '',
//         mdSpotify: '',
//         mdSoundcloud: ''
//       }
//     };

//     try {
//       await api.put('/Usuario/UpdateUsuario', payload);
//       console.log('Usuario actualizado con domicilio');
//     } catch (err) {
//       console.error('Error al actualizar usuario:', err);
//     }
//   }

//   // Mostrar modal de confirmación
//   setModalVisible(true);
// };



//   return (
//     <div>
//       <div className="sm:px-10 mb-11">
//         <NavBar />
//         <h1 className='mx-10 sm:px-10 mt-2 mb-5 text-2xl font-bold'>Resumen de tu compra:</h1>

//         <div className="mx-6 sm:px-10">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
//   {/* Imagen del evento */}
//   <div className="flex justify-center lg:justify-start">
//     <img
//       src={imagenEvento}
//       alt="Imagen del evento"
//       className="
//         rounded-xl shadow-md object-contain
//         h-40 sm:h-48 md:h-56 lg:h-64
//         w-[90%] sm:w-80 md:w-96 lg:w-full"
//     />
//   </div>

//   {/* Info entradas - solo ocupa segunda columna en lg */}
//   <div className="flex flex-col gap-4 lg:col-span-1 self-center">
//     {purchaseItems.map((item, index) => (
//       <div key={index} className="bg-base-100 shadow-xl p-4">
//         <p className="text-sm md:text-base font-semibold">Evento: {evento.nombreEvento}</p>
//         <p className="text-sm md:text-base">
//           <strong>{item.cantidad} x {item.tipo}</strong> para el día <strong>{item.dia}</strong> a ${item.precio} c/u
//         </p>
//         <p className="text-sm md:text-base">Subtotal: ${item.itemSubtotal}</p>
//       </div>
//     ))}
//   </div>

//   {/* Columna vacía solo visible en lg */}
//   <div className="hidden lg:block" />
// </div>



//           <div className="my-5 text-sm md:text-base">
//             <p className="font-semibold">Subtotal: ${subtotal}</p>
//             <p className="font-semibold text-green-700">Cargo por servicio: ${serviceFee}</p>
//             <p className="text-lg md:text-xl font-bold">Total: ${total}</p>
//           </div>

//         </div>


//         <h2 className='mx-6 sm:px-10 mt-4 mb-3 text-2xl font-bold'>Tus datos:</h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-16">

//           {/* Fila 1: Nombre y Apellido */}
//           <div className="form-control col-span-1">
//             <label className="label"><span className="label-text">Nombre:</span></label>
//             <input type="text" value={form.nombre} disabled className="input input-bordered w-full bg-gray-100" />
//           </div>
//           <div className="form-control col-span-1">
//             <label className="label"><span className="label-text">Apellido:</span></label>
//             <input type="text" value={form.apellido} disabled className="input input-bordered w-full bg-gray-100" />
//           </div>
//           <div className="hidden lg:block" /> {/* col 3 vacía */}

//           {/* Fila 2: Email y Teléfono */}
//           <div className="form-control col-span-1">
//             <label className="label"><span className="label-text">Email:</span></label>
//             <input type="email" value={form.email} disabled className="input input-bordered w-full bg-gray-100" />
//           </div>
//           <div className="form-control col-span-1">
//             <label className="label"><span className="label-text">Teléfono:</span></label>
//             <input
//               type="tel"
//               name="telefono"
//               value={form.telefono}
//               onChange={handleChange}
//               required
//               disabled={!isEditable('telefono')}
//               className={`input input-bordered w-full ${!isEditable('telefono') ? 'bg-gray-100' : ''} ${errors.telefono ? 'input-error' : ''}`}
//             />
//             {errors.telefono && <span className="text-error text-sm mt-1">{errors.telefono}</span>}
//           </div>
//           <div className="hidden lg:block" /> {/* col 3 vacía */}

//           {/* Fila 3: Tipo de identificación y número */}
//           <div className="form-control col-span-1">
//             <label className="label"><span className="label-text">Tipo de identificación:</span></label>
//             <select
//               className="select select-bordered w-full"
//               name="tipoId"
//               value={form.tipoId}
//               onChange={handleChange}
//               disabled={!isEditable('numeroId')}
//               required
//             >
//               <option value="DNI">DNI</option>
//               <option value="Pasaporte">Pasaporte</option>
//             </select>
//           </div>

//           <div className="form-control col-span-1">
//             <label className="label"><span className="label-text">Número de identificación:</span></label>
//             <input
//               type="text"
//               name="numeroId"
//               value={form.numeroId}
//               onChange={handleChange}
//               required
//               disabled={!isEditable('dni')}
//               className={`input input-bordered w-full ${!isEditable('dni') ? 'bg-gray-100' : ''} ${errors.numeroId ? 'input-error' : ''}`}
//             />
//             {errors.numeroId && <span className="text-error text-sm mt-1">{errors.numeroId}</span>}
//           </div>
//           <div className="hidden lg:block" /> {/* col 3 vacía */}

//           {/* Fila 4: Fecha de nacimiento */}
//           <div className="form-control col-span-1">
//             <label className="label"><span className="label-text">Fecha de nacimiento:</span></label>
//             <input
//               type="date"
//               name="birthdate"
//               value={form.birthdate}
//               onChange={handleChange}
//               required
//               disabled={!isEditable('dtNacimiento')}
//               className={`input input-bordered w-full ${!isEditable('dtNacimiento') ? 'bg-gray-100' : ''} ${errors.birthdate ? 'input-error' : ''}`}
//             />
//             {errors.birthdate && <span className="text-error text-sm mt-1">{errors.birthdate}</span>}
//           </div>
//           <div className="hidden lg:block" />
//           <div className="hidden lg:block" />

//           {/* Sección Domicilio */}
//           <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6">
//             <h3 className="text-lg font-semibold mb-2">Domicilio de facturación:</h3>

//             <InputUbicacionUsuario
//               initialProvincia={selectedProvincia?.nombre || ''}
//               initialMunicipio={selectedMunicipio?.nombre || ''}
//               initialLocalidad={selectedLocalidad?.nombre || ''}
//               disabled={!!usuarioData?.domicilio?.direccion}
//               onUbicacionChange={({ provincia, municipio, localidad }) => {
//                 setSelectedProvincia(provincia);
//                 setSelectedMunicipio(municipio);
//                 setSelectedLocalidad(localidad);
//               }}
//             />

//             <div className="form-control mt-4 max-w-xs">
//               <label className="label">
//                 <span className="label-text">Dirección (calle y número):</span>
//               </label>
//               <input
//                 type="text"
//                 value={direccion}
//                 onChange={e => setDireccion(e.target.value)}
//                 disabled={!!usuarioData?.domicilio?.direccion}
//                 className={`input input-bordered w-full ${usuarioData?.domicilio?.direccion ? 'bg-gray-100' : ''}`}
//               />
//             </div>
//           </div>


//           {/* Checkbox de Términos */}
//           <div className="form-control col-span-1 sm:col-span-2 lg:col-span-3 mt-2">
//             <div className="flex items-center">
//               <input type="checkbox" className="checkbox checkbox-secondary mt-1" required />
//               <span className="ml-2 text-sm">
//                 Acepto los <a href="/terminos" className="link link-secondary">Términos y Condiciones</a> y la <a href="/privacidad" className="link link-secondary">Política de Privacidad</a>.
//               </span>
//             </div>
//           </div>

//           {/* Aviso de perfil */}
//           <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-sm">
//             <p className='text-gray-600'>
//               Si necesitas modificar alguno de tus datos personales, por favor, ingresa a <a href="/miperfil" className="text-blue-600 underline">tu perfil</a> para poder editarlos.
//             </p>
//           </div>

//           {/* Aviso redirección */}
//           <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//             <p className='text-sm'>** Al hacer clic en comprar, se te mostrará una confirmación antes de redirigirte a MercadoPago.</p>
//           </div>

//           {/* Botón Comprar */}
//           <div className="col-span-1">
//             <button type="submit" className="btn btn-secondary rounded-xl">Comprar</button>
//           </div>
//         </form>



//       </div>

//       <Footer />

//       {modalVisible && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//             <h3 className="text-xl font-semibold mb-4">Redirección a MercadoPago</h3>
//             <p>Se te redirigirá a MercadoPago para que puedas completar la compra de tu/s entrada/s.</p>
//             <div className="mt-6 text-right">
//               <button className="btn btn-primary" onClick={() => setModalVisible(false)}>Ok</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }