import React, { useState, useEffect, useRef } from 'react';

const InputEntradasCantPrecio = ({
  diasEvento,
  onEntradasPorDiaChange,
  onEntradasChange,
  entradasIniciales = [],
  soloEditarPrecios = false
}) => {
  const [entradas, setEntradas] = useState([]);

  // Referencias para evitar loops infinitos
  const prevEntradasRef = useRef();
  const prevHayEBRef = useRef();

  useEffect(() => {
    if (entradasIniciales.length > 0) {
      setEntradas(entradasIniciales);
      prevEntradasRef.current = entradasIniciales;

      const earlyBirdsPorDia = entradasIniciales.map(e =>
        (e.generalesEarly > 0 && e.generalesEarlyPrice !== '') ||
        (e.vipEarly > 0 && e.vipEarlyPrice !== '')
      );
      if (typeof onEntradasPorDiaChange === 'function') {
        onEntradasPorDiaChange(earlyBirdsPorDia);
        prevHayEBRef.current = earlyBirdsPorDia;
      }
    }
  }, [entradasIniciales, onEntradasPorDiaChange]);



  // Notificar cambios en early birds por día
  useEffect(() => {
    if (typeof onEntradasPorDiaChange === 'function') {
      const nuevo = entradas.map(e =>
        (e.generalesEarly > 0 && e.generalesEarlyPrice !== '') ||
        (e.vipEarly > 0 && e.vipEarlyPrice !== '')
      );
      const anterior = prevHayEBRef.current;
      if (JSON.stringify(nuevo) !== JSON.stringify(anterior)) {
        onEntradasPorDiaChange(nuevo);
        prevHayEBRef.current = nuevo;
      }
    }
  }, [entradas, onEntradasPorDiaChange]);

  // Notificar cambios en las entradas completas
  useEffect(() => {
    if (typeof onEntradasChange === 'function') {
      const anterior = prevEntradasRef.current;
      if (JSON.stringify(entradas) !== JSON.stringify(anterior)) {
        onEntradasChange(entradas);
        prevEntradasRef.current = entradas;
      }
    }
  }, [entradas, onEntradasChange]);

  const handleEntradaChange = (diaIndex, campo, value) => {
    const cleanedValue = value.replace(/^0+(?!$)/, '');
    const newValue = cleanedValue === '' ? '' : String(parseInt(cleanedValue, 10));

    setEntradas(prevEntradas => {
      const updatedEntradas = [...prevEntradas];
      const currentDia = updatedEntradas[diaIndex];

      const parsedNumber = parseInt(newValue, 10) || 0;

      if (campo === 'generalesEarly') {
        const correctedValue = parsedNumber > currentDia.generales ? currentDia.generales : parsedNumber;
        updatedEntradas[diaIndex] = { ...currentDia, generalesEarly: correctedValue };
      } else if (campo === 'vipEarly') {
        const correctedValue = parsedNumber > currentDia.vip ? currentDia.vip : parsedNumber;
        updatedEntradas[diaIndex] = { ...currentDia, vipEarly: correctedValue };
      } else {
        updatedEntradas[diaIndex] = { ...currentDia, [campo]: parsedNumber };

        if (campo === 'generales') {
          if (parsedNumber === 0) updatedEntradas[diaIndex].generalesEarly = 0;
          else if (parsedNumber < currentDia.generalesEarly)
            updatedEntradas[diaIndex].generalesEarly = parsedNumber;
        }

        if (campo === 'vip') {
          if (parsedNumber === 0) updatedEntradas[diaIndex].vipEarly = 0;
          else if (parsedNumber < currentDia.vipEarly)
            updatedEntradas[diaIndex].vipEarly = parsedNumber;
        }
      }

      return updatedEntradas;
    });
  };


  const handlePriceChange = (diaIndex, campo, e) => {
    let inputValue = e.target.value.replace('$', '').replace(/\D/g, '');
    inputValue = inputValue.replace(/^0+(?!$)/, ''); // Elimina ceros a la izquierda
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
                  <input
                    type="number"
                    min="0"
                    placeholder="Cantidad"
                    className="input input-bordered w-32"
                    value={String(diaEntradas.generales)}
                    onChange={e => handleEntradaChange(index, 'generales', e.target.value)}
                    disabled={soloEditarPrecios}
                  />


                  <input type="text" placeholder="Precio" className="input input-bordered w-32"
                    value={diaEntradas.generalesPrice ? `$${diaEntradas.generalesPrice}` : ''}
                    onChange={e => handlePriceChange(index, 'generalesPrice', e)} />

                </div>
                <p className="text-sm text-gray-500 mt-1">La cantidad ingresada es el total de entradas generales. <br></br>Si agregas entradas EarlyBirds Generales, estas ya forman parte del total de entradas Generales, no se suman a la cantidad total.<br></br>Ejemplo: Si ingresas 900 entradas Generales, y 100 Early Birds, el total es 900, no 1000.</p>
                <h4 className="font-semibold mt-3">Early Bird General (opcional):</h4>
                <div className="flex space-x-2">
                  <input type="number" min="0" placeholder="Cantidad EarlyBird" className="input input-bordered w-32"
                    value={String(diaEntradas.generalesEarly)}
                    onChange={e => handleEntradaChange(index, 'generalesEarly', e.target.value)}
                    disabled={soloEditarPrecios || diaEntradas.generales === 0} max={diaEntradas.generales} />

                  <input type="text" placeholder="Precio EarlyBird" className="input input-bordered w-32"
                    value={diaEntradas.generalesEarlyPrice ? `$${diaEntradas.generalesEarlyPrice}` : ''}
                    onChange={e => handlePriceChange(index, 'generalesEarlyPrice', e)}
                    disabled={diaEntradas.generales === 0} />

                </div>
              </div>

              {/* VIP */}
              <div className="mb-6">
                <h4 className="font-semibold">Entradas VIP (opcional):</h4>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Cantidad"
                    className="input input-bordered w-32"
                    value={String(diaEntradas.vip)}
                    onChange={e => handleEntradaChange(index, 'vip', e.target.value)}
                    disabled={soloEditarPrecios}
                  />


                  <input type="text" placeholder="Precio" className="input input-bordered w-32"
                    value={diaEntradas.vipPrice ? `$${diaEntradas.vipPrice}` : ''}
                    onChange={e => handlePriceChange(index, 'vipPrice', e)} />

                </div>
                <p className="text-sm text-gray-500 mt-1">La cantidad ingresada es el total de entradas vip. <br></br>Si agregas entradas EarlyBirds Vip, estas ya forman parte del total de entradas Vip, no se suman a la cantidad total.<br></br>Ejemplo: Si ingresas 800 entradas Vip, y 200 Early Birds, el total es 800, no 1000.</p>
                <h4 className="font-semibold mt-3">Early Bird VIP (opcional):</h4>
                <div className="flex space-x-2">
                  <input type="number" min="0" placeholder="Cantidad EarlyBird" className="input input-bordered w-32"
                    value={String(diaEntradas.vipEarly)}
                    onChange={e => handleEntradaChange(index, 'vipEarly', e.target.value)}
                    disabled={soloEditarPrecios || diaEntradas.vip === 0} max={diaEntradas.vip} />

                  <input type="text" placeholder="Precio EarlyBird" className="input input-bordered w-32"
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
