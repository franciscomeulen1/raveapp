// TablaDeEntradas.js
import React, { useEffect, useState } from 'react';
import api from '../../componenteapi/api';

export default function TablaDeEntradas({ idFecha, diaIndex, onCantidadChange }) {
  const [entradasDisponibles, setEntradasDisponibles] = useState([]);

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const [resEntradas, resTipos] = await Promise.all([
          api.get(`/Entrada/GetEntradasFecha?IdFecha=${idFecha}&Estado=0`),
          api.get(`/Entrada/GetTiposEntrada`)
        ]);

        const tiposMap = {};
        resTipos.data.forEach(tipo => {
          tiposMap[tipo.cdTipo] = tipo.dsTipo;
        });

        const procesadas = resEntradas.data.map(e => ({
          cdTipo: e.tipo.cdTipo,
          tipo: tiposMap[e.tipo.cdTipo] || 'Sin nombre',
          precio: e.precio,
          cantidad: e.cantidad
        }));

        setEntradasDisponibles(procesadas);
      } catch (err) {
        console.error('Error al cargar entradas disponibles:', err);
      }
    };

    if (idFecha) {
      fetchEntradas();
    }
  }, [idFecha]);

  const handleSelectChange = () => {
    const total = Array.from(document.querySelectorAll(`[name^="dia-${diaIndex}-entrada-"]`))
      .map(select => parseInt(select.value))
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);
    onCantidadChange(total);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {entradasDisponibles.length > 0 ? (
            entradasDisponibles.map((entrada, index) => (
              <tr key={index}>
                <td className="lg-min:text-sm">{entrada.tipo}</td>
                <td>${entrada.precio}</td>
                <td>
                  {entrada.cantidad === 0 ? (
                    <span className="text-red-600 font-semibold">Agotadas</span>
                  ) : (
                    <select
                      name={`dia-${diaIndex}-entrada-${index}`}
                      className="select select-bordered w-full max-w-xs"
                      data-precio={entrada.precio}
                      data-tipo={entrada.tipo}
                      defaultValue="0"
                      onChange={handleSelectChange}
                    >
                      {[...Array(Math.min(10, entrada.cantidad) + 1).keys()].map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-sm italic">
                No hay entradas disponibles para esta fecha.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}