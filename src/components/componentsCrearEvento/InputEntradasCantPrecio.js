import React, { useState, useEffect } from 'react';

const InputEntradasCantPrecio = ({ diasEvento, onEntradasPorDiaChange, onEntradasChange, entradasIniciales = [] }) => {
  const [entradas, setEntradas] = useState([]);

  // Inicialización (una sola vez)
  useEffect(() => {
    if (entradasIniciales.length > 0) {
      setEntradas(entradasIniciales);
    } else {
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
      setEntradas(nuevasEntradas);
      if (typeof onEntradasPorDiaChange === 'function') {
        onEntradasPorDiaChange(Array.from({ length: diasEvento }, () => false));
      }
    }
  }, [diasEvento, entradasIniciales, onEntradasPorDiaChange]);

  useEffect(() => {
    if (typeof onEntradasPorDiaChange === 'function') {
      const hayEarlyBirdsPorDia = entradas.map(e =>
        (e.generalesEarly > 0 && e.generalesEarlyPrice !== '') ||
        (e.vipEarly > 0 && e.vipEarlyPrice !== '')
      );
      onEntradasPorDiaChange(hayEarlyBirdsPorDia);
    }
  }, [entradas, onEntradasPorDiaChange]);

  useEffect(() => {
    if (typeof onEntradasChange === 'function') {
      onEntradasChange(entradas);
    }
  }, [entradas, onEntradasChange]);

  const handleEntradaChange = (diaIndex, campo, value) => {
    const newValue = parseInt(value, 10) || 0;
    setEntradas(prevEntradas => {
      const updatedEntradas = [...prevEntradas];
      const currentDia = updatedEntradas[diaIndex];

      if (campo === 'generalesEarly') {
        const correctedValue = newValue > currentDia.generales ? currentDia.generales : newValue;
        updatedEntradas[diaIndex] = { ...currentDia, generalesEarly: correctedValue };
      } else if (campo === 'vipEarly') {
        const correctedValue = newValue > currentDia.vip ? currentDia.vip : newValue;
        updatedEntradas[diaIndex] = { ...currentDia, vipEarly: correctedValue };
      } else {
        updatedEntradas[diaIndex] = { ...currentDia, [campo]: newValue };

        if (campo === 'generales') {
          if (newValue === 0) updatedEntradas[diaIndex].generalesEarly = 0;
          else if (newValue < currentDia.generalesEarly)
            updatedEntradas[diaIndex].generalesEarly = newValue;
        }

        if (campo === 'vip') {
          if (newValue === 0) updatedEntradas[diaIndex].vipEarly = 0;
          else if (newValue < currentDia.vipEarly)
            updatedEntradas[diaIndex].vipEarly = newValue;
        }
      }
      return updatedEntradas;
    });
  };

  const handlePriceChange = (diaIndex, campo, e) => {
    let inputValue = e.target.value.replace('$', '').replace(/\D/g, '');
    setEntradas(prevEntradas => {
      const updated = [...prevEntradas];
      const currentDia = updated[diaIndex];

      if (campo === 'generalesEarlyPrice') {
        if (currentDia.generalesPrice && parseInt(inputValue, 10) > parseInt(currentDia.generalesPrice, 10)) {
          inputValue = currentDia.generalesPrice;
        }
      } else if (campo === 'vipEarlyPrice') {
        if (currentDia.vipPrice && parseInt(inputValue, 10) > parseInt(currentDia.vipPrice, 10)) {
          inputValue = currentDia.vipPrice;
        }
      }

      updated[diaIndex] = { ...currentDia, [campo]: inputValue };
      return updated;
    });
  };

  return (
    <div>
      {entradas.map((diaEntradas, index) => {
        const totalGeneral = diaEntradas.generales;
        const totalVIP = diaEntradas.vip;
        const totalEntradas = totalGeneral + totalVIP;

        return (
          <div key={index} className="mb-6">
            <h3 className="font-bold text-lg my-4">Entradas para el día {index + 1}:</h3>
            <div className="border p-4 rounded-md">
              {/* Generales */}
              <div className="mb-6">
                <h4 className="font-semibold">Entradas Generales <span className="text-red-500">*</span></h4>
                <div className="flex space-x-2">
                  <input type="number" min="0" placeholder="Cantidad" className="input input-bordered w-20"
                    value={diaEntradas.generales} onChange={e => handleEntradaChange(index, 'generales', e.target.value)} />
                  <input type="text" placeholder="Precio" className="input input-bordered w-20"
                    value={diaEntradas.generalesPrice ? `$${diaEntradas.generalesPrice}` : ''}
                    onChange={e => handlePriceChange(index, 'generalesPrice', e)} />
                </div>
                <p className="text-sm text-gray-500 mt-1">La cantidad ingresada es el total de entradas generales...</p>
                <h4 className="font-semibold mt-3">Early Bird General (opcional):</h4>
                <div className="flex space-x-2">
                  <input type="number" min="0" placeholder="Cantidad EarlyBird" className="input input-bordered w-20"
                    value={diaEntradas.generalesEarly}
                    onChange={e => handleEntradaChange(index, 'generalesEarly', e.target.value)}
                    disabled={diaEntradas.generales === 0} max={diaEntradas.generales} />
                  <input type="text" placeholder="Precio EarlyBird" className="input input-bordered w-20"
                    value={diaEntradas.generalesEarlyPrice ? `$${diaEntradas.generalesEarlyPrice}` : ''}
                    onChange={e => handlePriceChange(index, 'generalesEarlyPrice', e)}
                    disabled={diaEntradas.generales === 0} />
                </div>
              </div>

              {/* VIP */}
              <div className="mb-6">
                <h4 className="font-semibold">Entradas VIP (opcional):</h4>
                <div className="flex space-x-2">
                  <input type="number" min="0" placeholder="Cantidad" className="input input-bordered w-20"
                    value={diaEntradas.vip} onChange={e => handleEntradaChange(index, 'vip', e.target.value)} />
                  <input type="text" placeholder="Precio" className="input input-bordered w-20"
                    value={diaEntradas.vipPrice ? `$${diaEntradas.vipPrice}` : ''}
                    onChange={e => handlePriceChange(index, 'vipPrice', e)} />
                </div>
                <h4 className="font-semibold mt-3">Early Bird VIP (opcional):</h4>
                <div className="flex space-x-2">
                  <input type="number" min="0" placeholder="Cantidad EarlyBird" className="input input-bordered w-20"
                    value={diaEntradas.vipEarly}
                    onChange={e => handleEntradaChange(index, 'vipEarly', e.target.value)}
                    disabled={diaEntradas.vip === 0} max={diaEntradas.vip} />
                  <input type="text" placeholder="Precio EarlyBird" className="input input-bordered w-20"
                    value={diaEntradas.vipEarlyPrice ? `$${diaEntradas.vipEarlyPrice}` : ''}
                    onChange={e => handlePriceChange(index, 'vipEarlyPrice', e)}
                    disabled={diaEntradas.vip === 0} />
                </div>
              </div>

              <p className="mt-4 text-green-700 font-bold">
                Cantidad total de entradas: {totalEntradas}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InputEntradasCantPrecio;


// import React, { useState, useEffect } from 'react';

// const InputEntradasCantPrecio = ({ diasEvento, onEntradasPorDiaChange, onEntradasChange }) => {
//   const [entradas, setEntradas] = useState([]);

//   useEffect(() => {
//     const nuevasEntradas = Array.from({ length: diasEvento }, () => ({
//       generales: 0,
//       generalesEarly: 0,
//       vip: 0,
//       vipEarly: 0,
//       generalesPrice: "",
//       generalesEarlyPrice: "",
//       vipPrice: "",
//       vipEarlyPrice: "",
//     }));
//     setEntradas(nuevasEntradas);

//     if (typeof onEntradasPorDiaChange === 'function') {
//       onEntradasPorDiaChange(Array.from({ length: diasEvento }, () => false));
//     }
//   }, [diasEvento, onEntradasPorDiaChange]);

//   useEffect(() => {
//     if (typeof onEntradasPorDiaChange === 'function') {
//       const hayEarlyBirdsPorDia = entradas.map(e =>
//         (e.generalesEarly > 0 && e.generalesEarlyPrice !== "") ||
//         (e.vipEarly > 0 && e.vipEarlyPrice !== "")
//       );
//       onEntradasPorDiaChange(hayEarlyBirdsPorDia);
//     }
//   }, [entradas, onEntradasPorDiaChange]);

//   useEffect(() => {
//     if (typeof onEntradasChange === 'function') {
//       onEntradasChange(entradas);
//     }
//   }, [entradas, onEntradasChange]);

//   const handleEntradaChange = (diaIndex, campo, value) => {
//     const newValue = parseInt(value, 10) || 0;
//     setEntradas(prevEntradas => {
//       const updatedEntradas = [...prevEntradas];
//       const currentDia = updatedEntradas[diaIndex];

//       if (campo === 'generalesEarly') {
//         // Limita el valor a la cantidad de entradas generales
//         const correctedValue = newValue > currentDia.generales ? currentDia.generales : newValue;
//         updatedEntradas[diaIndex] = { ...currentDia, generalesEarly: correctedValue };
//       } else if (campo === 'vipEarly') {
//         // Limita el valor a la cantidad de entradas VIP
//         const correctedValue = newValue > currentDia.vip ? currentDia.vip : newValue;
//         updatedEntradas[diaIndex] = { ...currentDia, vipEarly: correctedValue };
//       } else {
//         // Actualiza el campo normalmente.
//         updatedEntradas[diaIndex] = { ...currentDia, [campo]: newValue };

//         // Para el campo de generales:
//         if (campo === 'generales') {
//           if (newValue === 0) {
//             updatedEntradas[diaIndex].generalesEarly = 0;
//           } else if (newValue < currentDia.generalesEarly) {
//             // Si se reduce la cantidad generales por debajo de los early birds, se ajusta early birds.
//             updatedEntradas[diaIndex].generalesEarly = newValue;
//           }
//         }

//         // Para el campo de VIP:
//         if (campo === 'vip') {
//           if (newValue === 0) {
//             updatedEntradas[diaIndex].vipEarly = 0;
//           } else if (newValue < currentDia.vipEarly) {
//             updatedEntradas[diaIndex].vipEarly = newValue;
//           }
//         }
//       }
//       return updatedEntradas;
//     });
//   };

//   const handlePriceChange = (diaIndex, campo, e) => {
//     let inputValue = e.target.value;
//     // Elimina el símbolo "$" si está presente.
//     if (inputValue.startsWith('$')) {
//       inputValue = inputValue.slice(1);
//     }
//     // Permite únicamente dígitos (números enteros).
//     inputValue = inputValue.replace(/\D/g, '');
//     setEntradas(prevEntradas => {
//       const updated = [...prevEntradas];
//       const currentDia = updated[diaIndex];

//       // Para los precios early bird, se verifica que no sean mayores que el precio común.
//       if (campo === 'generalesEarlyPrice') {
//         if (currentDia.generalesPrice && parseInt(inputValue, 10) > parseInt(currentDia.generalesPrice, 10)) {
//           inputValue = currentDia.generalesPrice;
//         }
//       } else if (campo === 'vipEarlyPrice') {
//         if (currentDia.vipPrice && parseInt(inputValue, 10) > parseInt(currentDia.vipPrice, 10)) {
//           inputValue = currentDia.vipPrice;
//         }
//       } else if (campo === 'generalesPrice') {
//         // Si se actualiza el precio común, ajustar early bird si es mayor.
//         if (currentDia.generalesEarlyPrice && parseInt(currentDia.generalesEarlyPrice, 10) > parseInt(inputValue, 10)) {
//           currentDia.generalesEarlyPrice = inputValue;
//         }
//       } else if (campo === 'vipPrice') {
//         if (currentDia.vipEarlyPrice && parseInt(currentDia.vipEarlyPrice, 10) > parseInt(inputValue, 10)) {
//           currentDia.vipEarlyPrice = inputValue;
//         }
//       }

//       updated[diaIndex] = { ...currentDia, [campo]: inputValue };
//       return updated;
//     });
//   };

//   return (
//     <div>
//       {entradas.map((diaEntradas, index) => {
//         const totalGeneral = diaEntradas.generales; // early birds son parte de las generales
//         const totalVIP = diaEntradas.vip; // early birds VIP son parte de las VIP
//         const totalEntradas = totalGeneral + totalVIP;

//         return (
//           <div key={index} className="mb-6">
//             <h3 className="font-bold text-lg my-4">Entradas para el día {index + 1}:</h3>
//             <div className="border p-4 rounded-md">
//               {/* Sección de Entradas Generales */}
//               <div className="mb-6">
//                 <h4 className="font-semibold">
//                   Entradas Generales <span className="text-red-500">*</span>
//                 </h4>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     min="0"
//                     placeholder="Cantidad"
//                     className="input input-bordered w-20"
//                     value={diaEntradas.generales}
//                     onChange={e => handleEntradaChange(index, 'generales', e.target.value)}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Precio"
//                     className="input input-bordered w-20"
//                     value={diaEntradas.generalesPrice ? `$${diaEntradas.generalesPrice}` : ''}
//                     onChange={e => handlePriceChange(index, 'generalesPrice', e)}
//                   />
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   La cantidad ingresada es el total de entradas generales. De estas, puedes definir cuántas serán Early Bird (se venderán a menor precio).
//                 </p>
//                 <h4 className="font-semibold mt-3">Early Bird General (opcional):</h4>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     min="0"
//                     placeholder="Cantidad EarlyBird"
//                     className="input input-bordered w-20"
//                     value={diaEntradas.generalesEarly}
//                     onChange={e => handleEntradaChange(index, 'generalesEarly', e.target.value)}
//                     disabled={diaEntradas.generales === 0}
//                     max={diaEntradas.generales}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Precio EarlyBird"
//                     className="input input-bordered w-20"
//                     value={diaEntradas.generalesEarlyPrice ? `$${diaEntradas.generalesEarlyPrice}` : ''}
//                     onChange={e => handlePriceChange(index, 'generalesEarlyPrice', e)}
//                     disabled={diaEntradas.generales === 0}
//                   />
//                 </div>
//                 {/* Mensaje para entradas generales */}
//                 <p className="mt-2 text-blue-600 font-medium">
//                   Se venderán un total de {diaEntradas.generales} entradas generales para el día del evento.
//                 </p>
//               </div>

//               {/* Sección de Entradas VIP */}
//               <div className="mb-6">
//                 <h4 className="font-semibold">Entradas VIP (opcional):</h4>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     min="0"
//                     placeholder="Cantidad"
//                     className="input input-bordered w-20"
//                     value={diaEntradas.vip}
//                     onChange={e => handleEntradaChange(index, 'vip', e.target.value)}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Precio"
//                     className="input input-bordered w-20"
//                     value={diaEntradas.vipPrice ? `$${diaEntradas.vipPrice}` : ''}
//                     onChange={e => handlePriceChange(index, 'vipPrice', e)}
//                   />
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Las entradas VIP son opcionales. Si decides ofrecerlas, también puedes definir Early Bird para estas entradas.
//                 </p>
//                 <h4 className="font-semibold mt-3">Early Bird VIP (opcional):</h4>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     min="0"
//                     placeholder="Cantidad EarlyBird"
//                     className="input input-bordered w-20"
//                     value={diaEntradas.vipEarly}
//                     onChange={e => handleEntradaChange(index, 'vipEarly', e.target.value)}
//                     disabled={diaEntradas.vip === 0}
//                     max={diaEntradas.vip}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Precio EarlyBird"
//                     className="input input-bordered w-20"
//                     value={diaEntradas.vipEarlyPrice ? `$${diaEntradas.vipEarlyPrice}` : ''}
//                     onChange={e => handlePriceChange(index, 'vipEarlyPrice', e)}
//                     disabled={diaEntradas.vip === 0}
//                   />
//                 </div>
//                 {/* Mensaje para entradas VIP */}
//                 <p className="mt-2 text-blue-600 font-medium">
//                   Se venderán un total de {diaEntradas.vip} entradas VIP para el día del evento.
//                 </p>
//               </div>

//               {/* Mensaje total de entradas */}
//               <p className="mt-4 text-green-700 font-bold">
//                 Cantidad total de entradas que se venderán para el día del evento: {totalEntradas}
//               </p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default InputEntradasCantPrecio;