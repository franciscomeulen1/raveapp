// src/components/DejarResenia.jsx
import React, { useEffect, useMemo, useState } from 'react';
import api from '../componenteapi/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // (importado como pediste)

export default function DejarResenia({
    open,
    onClose,
    idFiesta,
    idUsuario,
    fiestaNombrePreset,
    onSuccess,
}) {
    const [fiestaNombre, setFiestaNombre] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState('');
    const [okMsg, setOkMsg] = useState('');

    const [isEdit, setIsEdit] = useState(false);
    const [idResenia, setIdResenia] = useState(null);
    const [estrellas, setEstrellas] = useState(0);
    const [comentario, setComentario] = useState('');
    const [dtInsert, setDtInsert] = useState(null);
    const [justDeleted, setJustDeleted] = useState(false);

    const [confirmingDelete, setConfirmingDelete] = useState(false);

    // --- Nuevo: estado para hover visual de estrellas ---
    const [hoverStar, setHoverStar] = useState(0);

    const headerText = useMemo(() => (
        <>
            Has asistido a un evento de la fiesta{' '}
            <span className="font-semibold">{fiestaNombre || '...'}</span>. Si lo deseas, puedes dejar tu reseña
            sobre la fiesta.
        </>
    ), [fiestaNombre]);

    const dtInsertFormatted = useMemo(() => {
        if (!dtInsert) return '';
        try {
            const d = new Date(dtInsert);
            const fecha = d.toLocaleDateString('es-AR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            });
            const hora = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
            return `${fecha}, ${hora}`;
        } catch {
            return dtInsert;
        }
    }, [dtInsert]);

    useEffect(() => {
        let ignore = false;
        const load = async () => {
            if (!open) return;

            setErr(''); setOkMsg(''); setSubmitting(false);
            setJustDeleted(false); setConfirmingDelete(false);

            setIsEdit(false); setIdResenia(null);
            setEstrellas(0); setComentario(''); setDtInsert(null);
            setHoverStar(0);

            if (fiestaNombrePreset) {
                setFiestaNombre(fiestaNombrePreset);
            } else if (idFiesta) {
                try {
                    setLoading(true);
                    const resFiesta = await api.get('/Fiesta/GetFiestas', { params: { IdFiesta: idFiesta } });
                    const fiesta = Array.isArray(resFiesta.data?.fiestas) ? resFiesta.data.fiestas[0] : null;
                    if (!ignore) setFiestaNombre(fiesta?.dsNombre || '');
                } catch { if (!ignore) setFiestaNombre(''); }
                finally { if (!ignore) setLoading(false); }
            } else {
                setFiestaNombre('');
            }

            if (idFiesta && idUsuario) {
                try {
                    setLoading(true);
                    const res = await api.get('/Resenia/GetResenias', {
                        params: { IdFiesta: idFiesta, IdUsuario: idUsuario },
                    });
                    const r = Array.isArray(res.data?.resenias) ? res.data.resenias[0] : null;
                    if (!ignore && r) {
                        setIsEdit(true);
                        setIdResenia(r.idResenia);
                        setEstrellas(Number(r.estrellas || 0));
                        setComentario(r.comentario || '');
                        setDtInsert(r.dtInsert || null);
                    }
                } catch {
                    if (!ignore) { setIsEdit(false); setIdResenia(null); setDtInsert(null); }
                } finally { if (!ignore) setLoading(false); }
            }
        };
        load();
        return () => { ignore = true; };
    }, [open, idFiesta, idUsuario, fiestaNombrePreset]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr(''); setOkMsg('');
        if (!idUsuario || !idFiesta) return setErr('Faltan datos para registrar la reseña. Intenta nuevamente.');
        if (estrellas < 1 || estrellas > 5) return setErr('Selecciona una calificación entre 1 y 5 estrellas.');

        try {
            setSubmitting(true);
            if (isEdit && idResenia) {
                await api.put('/Resenia', {
                    idResenia: String(idResenia),
                    estrellas: Number(estrellas),
                    comentario: comentario?.trim() || '',
                });
                setOkMsg('¡Tu reseña se actualizó correctamente!');
                setDtInsert(new Date().toISOString());
            } else {
                await api.post('/Resenia', {
                    idUsuario: String(idUsuario),
                    estrellas: Number(estrellas),
                    comentario: comentario?.trim() || '',
                    idFiesta: String(idFiesta),
                });
                setOkMsg('¡Tu reseña se registró correctamente!');
                setIsEdit(true);
                try {
                    const res = await api.get('/Resenia/GetResenias', {
                        params: { IdFiesta: idFiesta, IdUsuario: idUsuario },
                    });
                    const r = Array.isArray(res.data?.resenias) ? res.data.resenias[0] : null;
                    if (r) { setIdResenia(r.idResenia || null); setDtInsert(r.dtInsert || null); }
                } catch { setDtInsert(new Date().toISOString()); }
            }
            onSuccess?.();
        } catch (error) {
            console.error(error);
            setErr('Ocurrió un error al procesar tu reseña. Intenta más tarde.');
        } finally { setSubmitting(false); }
    };

    const handleDeleteClick = () => { setErr(''); setOkMsg(''); setConfirmingDelete(true); };
    const handleCancelDelete = () => setConfirmingDelete(false);

    const handleConfirmDelete = async () => {
        if (!idResenia) return;
        setErr(''); setOkMsg('');
        try {
            setSubmitting(true);
            await api.delete(`/Resenia/${idResenia}`);
            setOkMsg(`Tu reseña sobre la fiesta ${fiestaNombre || ''} se ha eliminado`);
            setJustDeleted(true);
            setConfirmingDelete(false);
            setIsEdit(false); setIdResenia(null); setEstrellas(0); setComentario(''); setDtInsert(null);
            setHoverStar(0);
            onSuccess?.();
        } catch (error) {
            console.error(error);
            setErr('No se pudo eliminar tu reseña. Intenta nuevamente.');
        } finally { setSubmitting(false); }
    };

    // --- NUEVO: render de estrellas seleccionables con FontAwesome ---
    const currentVisual = hoverStar > 0 ? hoverStar : estrellas;
    const onKeyDownStars = (e) => {
        if (submitting) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            setEstrellas((prev) => Math.min(5, Math.max(1, (prev || 0) + 1)));
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setEstrellas((prev) => Math.min(5, Math.max(1, (prev || 0) - 1)));
        } else if (e.key === '0') {
            e.preventDefault();
            setEstrellas(0);
        }
    };

    return (
        <div className={`modal ${open ? 'modal-open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
            <div className="modal-box max-w-lg">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-xl">
                        {justDeleted ? 'Reseña eliminada' : isEdit ? 'Tu reseña' : 'Dejar reseña'}
                    </h3>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Cerrar">✕</button>
                </div>

                <p className="mt-3 text-sm">{justDeleted ? <>Puedes cerrar esta ventana.</> : headerText}</p>

                {isEdit && !justDeleted && dtInsertFormatted && (
                    <div className="mt-2 text-xs opacity-70">Última actualización: {dtInsertFormatted}</div>
                )}

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                    {loading && <div className="alert"><span>Cargando información…</span></div>}

                    {confirmingDelete && !justDeleted ? (
                        <div className="space-y-4">
                            <div className="alert alert-warning">
                                <span>
                                    ¿Eliminar tu reseña de la fiesta <span className="font-semibold">{fiestaNombre || ''}</span>?<br />
                                    Esta acción no se puede deshacer.
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" className="btn btn-sm sm:btn-md" onClick={handleCancelDelete} disabled={submitting}>Cancelar</button>
                                <button type="button" className="btn btn-error btn-sm sm:btn-md" onClick={handleConfirmDelete} disabled={submitting}>Sí, eliminar</button>
                            </div>
                        </div>
                    ) : (
                        !justDeleted && (
                            <>
                                {/* --- CAMBIO: bloque de calificación con FontAwesome --- */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Calificación</label>

                                    <div
                                        className="flex items-center gap-1"
                                        role="radiogroup"
                                        aria-label="Calificación por estrellas"
                                        tabIndex={0}
                                        onKeyDown={onKeyDownStars}
                                        onBlur={() => setHoverStar(0)}
                                    >
                                        {[1, 2, 3, 4, 5].map((n) => {
                                            const filled = n <= currentVisual;
                                            return (
                                                <button
                                                    key={n}
                                                    type="button"
                                                    className="p-1"
                                                    onMouseEnter={() => setHoverStar(n)}
                                                    onMouseLeave={() => setHoverStar(0)}
                                                    onFocus={() => setHoverStar(n)}
                                                    onClick={() => setEstrellas(n)}
                                                    aria-checked={estrellas === n}
                                                    role="radio"
                                                    aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                                                    disabled={submitting}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        className={`h-5 w-5 sm:h-6 sm:w-6 ${filled ? 'text-yellow-500' : 'text-gray-300'}`}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {estrellas > 0 && <p className="text-xs opacity-70 mt-1">{estrellas} / 5</p>}
                                    {/* Nota: faStarHalfAlt queda importado por consistencia con otros componentes */}
                                </div>

                                <div>
                                    <label htmlFor="comentario" className="block text-sm font-semibold mb-2">
                                        Comentario {isEdit ? '(puedes modificarlo)' : '(opcional)'}
                                    </label>
                                    <textarea
                                        id="comentario"
                                        className="textarea textarea-bordered w-full"
                                        rows="4"
                                        placeholder="¿Qué te pareció la fiesta?"
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                        maxLength={1000}
                                        disabled={submitting}
                                    />
                                    <div className="text-xs opacity-70 text-right mt-1">{comentario.length}/1000</div>
                                </div>
                            </>
                        )
                    )}

                    {err && <div className="alert alert-error" role="alert" aria-live="assertive"><span>{err}</span></div>}
                    {okMsg && <div className="alert alert-success" role="status" aria-live="polite"><span>{okMsg}</span></div>}

                    {/* ACCIONES: móvil en 2 filas, desktop en 1 fila */}
                    <div className="modal-action w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        {/* Fila 1 (izquierda): Cerrar + Guardar/Enviar */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm sm:btn-md"
                                onClick={onClose}
                                disabled={submitting}
                            >
                                Cerrar
                            </button>

                            {!justDeleted && !confirmingDelete && (
                                <button
                                    type="submit"
                                    className={`btn btn-primary btn-sm sm:btn-md ${submitting ? 'btn-disabled' : ''}`}
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? (isEdit ? 'Guardando…' : 'Enviando…')
                                        : (isEdit ? 'Guardar cambios' : 'Enviar reseña')}
                                </button>
                            )}
                        </div>

                        {/* Fila 2 (móvil): Eliminar reseña a la derecha. En ≥sm vuelve a estar a la derecha en la misma fila */}
                        {isEdit && idResenia && !justDeleted && !confirmingDelete && (
                            <div className="w-full flex justify-end sm:w-auto sm:justify-normal">
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    disabled={submitting}
                                    className="text-error font-semibold hover:underline focus:underline inline-flex"
                                    aria-label="Eliminar reseña"
                                >
                                    Eliminar reseña
                                </button>
                            </div>

                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}