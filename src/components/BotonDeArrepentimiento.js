// src/components/BotonDeArrepentimiento.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../componenteapi/api';

export default function BotonDeArrepentimiento({
  open,
  onClose,
  idCompra,
  idUsuario,
  evento,
  fechaCompraISO,
  idFecha, // 👈 viene desde EntradaAdquirida
}) {
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null); // { amount, correo }
  const [errorMsg, setErrorMsg] = useState('');
  const [usuario, setUsuario] = useState(null);

  // 👇 NUEVO: banderas de validación
  const [isAfter10Days, setIsAfter10Days] = useState(false);
  const [isLessThan48h, setIsLessThan48h] = useState(false);

  // cuando abro, limpio estados
  useEffect(() => {
    if (open) {
      setChecked(false);
      setLoading(false);
      setSuccessData(null);
      setErrorMsg('');
      setIsAfter10Days(false);
      setIsLessThan48h(false);

      // 👇 calculamos las restricciones
      const now = new Date();

      // 1) más de 10 días desde la compra
      if (fechaCompraISO) {
        const compraDate = new Date(fechaCompraISO);
        if (!Number.isNaN(compraDate.getTime())) {
          const diffMs = now.getTime() - compraDate.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          if (diffDays > 10) {
            setIsAfter10Days(true);
          }
        }
      }

      // 2) faltan menos de 48hs para el evento
      // buscamos la fecha exacta del evento (la de esta compra)
      let startISO = null;
      if (evento) {
        // si el evento tiene varias fechas, buscamos la del idFecha
        if (Array.isArray(evento.fechas) && evento.fechas.length > 0) {
          const match =
            (idFecha &&
              evento.fechas.find(
                (f) => String(f.idFecha) === String(idFecha)
              )) ||
            evento.fechas[0];

          startISO =
            match?.inicio ||
            match?.fechaInicio ||
            evento?.inicioEvento ||
            null;
        } else {
          // evento sin array de fechas
          startISO = evento?.inicioEvento || null;
        }
      }

      if (startISO) {
        const eventStart = new Date(startISO);
        if (!Number.isNaN(eventStart.getTime())) {
          const diffMsToEvent = eventStart.getTime() - now.getTime();
          const diffHoursToEvent = diffMsToEvent / (1000 * 60 * 60);
          if (diffHoursToEvent < 48) {
            setIsLessThan48h(true);
          }
        }
      }
    }
  }, [open, fechaCompraISO, evento, idFecha]);

  // traer datos del usuario para el mail
  useEffect(() => {
    const fetchUser = async () => {
      if (!open) return;
      if (!idUsuario) return;
      try {
        const res = await api.get('/Usuario/GetUsuario', {
          params: { IdUsuario: idUsuario },
        });
        const u = res.data?.usuarios?.[0] || null;
        setUsuario(u);
      } catch (e) {
        console.error('Error obteniendo usuario para mail', e);
      }
    };
    fetchUser();
  }, [open, idUsuario]);

  if (!open) return null;

  const canRefund = !isAfter10Days && !isLessThan48h;

  const handleCancel = () => {
    if (loading) return;
    onClose && onClose();
  };

  const handleAccept = async () => {
    // doble check en runtime, por si cambió la hora o algo así
    if (!canRefund) {
      setErrorMsg(
        'No se puede procesar el reembolso porque no se cumplen las condiciones.'
      );
      return;
    }

    if (!checked) {
      setErrorMsg('Debes confirmar el checkbox para continuar.');
      return;
    }
    if (!idCompra) {
      setErrorMsg('No se encontró el id de la compra.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1) Reembolso
      const refundRes = await api.post('/Pago/Reembolso', null, {
        params: { idCompra },
      });
      const refundData = refundRes.data || {};
      const amount = refundData.amount ?? 0;
      const paymentId = refundData.paymentId;

      // 2) Email
      const nombreEvento = evento?.nombre || '';
      const correo = usuario?.correo || '';
      const nombre = usuario?.nombre || '';
      const apellido = usuario?.apellido || '';

      // fecha de compra en texto
      let fechaCompraTexto = '';
      if (fechaCompraISO) {
        const d = new Date(fechaCompraISO);
        if (!Number.isNaN(d.getTime())) {
          fechaCompraTexto = d.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
      }

      const cuerpo = `
<p>Estimado ${nombre} ${apellido},</p>
<p>
Has cancelado tu/s entrada/s al evento <strong>${nombreEvento}</strong> por un importe de <strong>$ ${amount}</strong>,
que habías adquirido el día ${fechaCompraTexto}.<br>
Dicho importe se te ha reembolsado al medio de pago que hayas utilizado en MercadoPago y lo verás acreditado dentro de los 7 días hábiles.
</p>
<p>Número de operación de MercadoPago: ${paymentId}</p>
<p>Atentamente,<br>El equipo de <strong>RaveApp</strong></p>
`;

      if (correo) {
        await api.post('/Email/EnvioMailGenerico', {
          to: correo,
          titulo: `Cancelación de entradas a evento ${nombreEvento}`,
          cuerpo,
          botonUrl: '',
          botonTexto: '',
        });
      }

      // 3) mostrar éxito
      setSuccessData({
        amount,
        correo,
      });
    } catch (e) {
      console.error('Error en reembolso o envío de mail', e);
      setErrorMsg(
        'Ocurrió un error al procesar el reembolso. Intenta nuevamente o comunicate con soporte.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    navigate('/mis-entradas');
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-base-100 rounded-2xl w-full max-w-xl p-6 shadow-xl space-y-5">
        {/* Título */}
        <h2 className="text-lg md:text-xl font-bold text-center">
          Botón de arrepentimiento - Cancelar compra de entradas
        </h2>

        {/* Si ya salió bien, muestro mensaje final */}
        {successData ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed">
              <span className="font-bold text-green-600">
                Cancelación realizada con éxito.
              </span>
              <br />
              Recibirás un mail con la confirmación de la cancelación de tus entradas y el reembolso a
              MercadoPago.
            </p>

            {successData.amount != null && (
              <p className="text-sm">
                <span className="font-semibold">Importe reembolsado:</span> ${successData.amount}
              </p>
            )}

            <div className="flex justify-end">
              <button onClick={handleOk} className="btn btn-primary">
                Ok
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Texto legal */}
            <p className="text-sm leading-relaxed">
              Contás con el derecho al reembolso de la compra de entradas siempre y cuando no hayan
              transcurrido 10 días corridos desde su compra, y siempre y cuando no falten menos de 48
              horas para que comience el evento.
              <br />
              Una vez recibida la solicitud, ejecutaremos el reembolso a la cuenta de MercadoPago de
              dónde salieron los fondos dentro de los 7 días hábiles.
            </p>

            {/* 👇 Si NO se puede reembolsar, mostramos el motivo y NO mostramos el checkbox */}
            {!canRefund ? (
              <>
                <div className="rounded-lg bg-red-100 text-red-700 text-sm p-3">
                  {isAfter10Days && (
                    <p>
                      No se puede cancelar la compra porque han pasado más de <strong>10 días</strong> desde que se realizó.
                    </p>
                  )}
                  {isLessThan48h && (
                    <p className="mt-2">
                      No se puede cancelar la compra porque faltan menos de <strong>48 horas</strong> para que comience el evento.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={handleCancel} className="btn btn-ghost">
                    Cerrar
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Checkbox */}
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary mt-1"
                    checked={checked}
                    onChange={(e) => {
                      setChecked(e.target.checked);
                      if (e.target.checked) setErrorMsg('');
                    }}
                  />
                  <span className="text-sm">
                    Confirmo que deseo reembolsar la orden mencionada en este formulario bajo los términos y
                    condiciones de nuestro servicio.
                    <br />
                    <span className="font-semibold">
                      Todo reembolso únicamente incluye el valor de la/s entrada/s, siendo excluido el costo por el
                      servicio utilizado.
                    </span>
                  </span>
                </label>

                {/* Error */}
                {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

                {/* Botones */}
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={handleCancel} className="btn btn-ghost" disabled={loading}>
                    Cancelar
                  </button>
                  <button
                    onClick={handleAccept}
                    className={`btn btn-secondary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    Aceptar
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
