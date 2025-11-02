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
}) {
    const navigate = useNavigate();

    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null); // { amount, correo }
    const [errorMsg, setErrorMsg] = useState('');
    const [usuario, setUsuario] = useState(null);

    // cuando abro, limpio estados
    useEffect(() => {
        if (open) {
            setChecked(false);
            setLoading(false);
            setSuccessData(null);
            setErrorMsg('');
        }
    }, [open]);

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
                // no cierro el modal, solo aviso si hace falta
            }
        };
        fetchUser();
    }, [open, idUsuario]);

    if (!open) return null;

    const handleCancel = () => {
        if (loading) return;
        onClose && onClose();
    };

    const handleAccept = async () => {
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

            // armo cuerpo
            //       const cuerpo = `Estimado ${nombre} ${apellido}:\n
            // Has cancelado tu/s entrada/s al evento ${nombreEvento} por un importe de ${amount} pesos, que habías adquirido el día ${fechaCompraTexto}. Dicho importe se te ha reembolsado a tu cuenta de MercadoPago y lo verás acreditado dentro de los 7 días hábiles.\n
            // Atentamente, el equipo de RaveApp`;
            const cuerpo = `
<p>Estimado ${nombre} ${apellido},</p>
<p>
Has cancelado tu/s entrada/s al evento <strong>${nombreEvento}</strong> por un importe de <strong>$ ${amount}</strong>,
que habías adquirido el día ${fechaCompraTexto}. <br>Dicho importe se te ha reembolsado al medio de pago que hayas utilizado en MercadoPago y lo verás acreditado dentro de los 7 días hábiles.
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
                            <span className="font-bold text-green-600">Cancelación realizada con éxito.</span><br /> Recibirás un mail con la confirmación de la
                            cancelación de tus entradas y el reembolso a MercadoPago.
                        </p>

                        {successData.amount != null && (
                            <p className="text-sm">
                                <span className="font-semibold">Importe reembolsado:</span> ${successData.amount}
                            </p>
                        )}

                        <div className="flex justify-end">
                            <button
                                onClick={handleOk}
                                className="btn btn-primary"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Texto legal */}
                        <p className="text-sm leading-relaxed">
                            Contás con el derecho al reembolso de la compra de entradas siempre y cuando no hayan
                            transcurrido 10 días corridos desde su compra, y siempre y cuando no falten menos de
                            48 horas para que comience el evento.
                            <br />
                            Una vez recibida la solicitud, ejecutaremos el reembolso a la cuenta de MercadoPago de
                            dónde salieron los fondos dentro de los 7 días hábiles.
                        </p>

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
                                Confirmo que deseo reembolsar la orden mencionada en este formulario bajo los
                                términos y condiciones de nuestro servicio.
                                <br />
                                <span className="font-semibold">
                                    Todo reembolso únicamente incluye el valor de la/s entrada/s, siendo excluido el
                                    costo por el servicio utilizado.
                                </span>
                            </span>
                        </label>

                        {/* Error */}
                        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

                        {/* Botones */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={handleCancel}
                                className="btn btn-ghost"
                                disabled={loading}
                            >
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
            </div>
        </div>
    );
}
