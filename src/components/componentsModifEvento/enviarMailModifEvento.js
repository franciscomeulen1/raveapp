// enviarMailModifEvento.js
import api from '../../componenteapi/api';

/**
 * Envía un mail masivo a todos los compradores de un evento
 * notificando que hubo una modificación y que pueden solicitar reembolso.
 *
 * NOTA: Si el endpoint responde 404 (no hay entradas pagas), se considera un caso esperado.
 */
export const enviarMailModifEvento = async ({ idEvento, nombreEvento }) => {
    if (!idEvento || !nombreEvento) {
        console.warn('enviarMailModificacionEvento: faltan datos (idEvento o nombreEvento).');
        return;
    }

    const payloadMail = {
        idEvento: String(idEvento),
        titulo: `Modificación de evento ${nombreEvento}`,
        cuerpo: `<p>Estimados: hubo una modificación en los detalles del evento ${nombreEvento}.</p>
<p>Por dicho motivo, si lo desean, pueden solicitar un reembolso de su entrada dentro de los 5 días corridos desde la percepción de este correo. <br>
El reembolso de la/s entrada/s se solicita ingreando a RaveApp &gt; Menú &gt; Mis Entradas &gt; Seleccionar la entrada correspondiente al evento &gt; Botón de arrepentimiento.</p> 
<p>Atentamente,<br>El equipo de <strong>RaveApp</strong></p>`,
        botonUrl: `https://raveapp.com.ar/evento/${idEvento}`,
        botonTexto: 'Ver evento',
    };

    try {
        await api.post('/Email/EnvioMailGenericoMasivo', payloadMail);
        console.log('Mail masivo de modificación de evento enviado correctamente.');
    } catch (err) {
        // 404 = no hay entradas en estado paga → es un caso esperado, no debe romper nada
        if (err.response && err.response.status === 404) {
            console.log(
                'EnvioMailGenericoMasivo devolvió 404 (sin entradas pagas). Caso esperado, se continúa normalmente.'
            );
            return;
        }

        console.error('Error al enviar mail de modificación de evento:', err);
        // Si querés, podrías mostrar un alert opcional acá, pero yo lo dejaría solo en consola
    }
};
