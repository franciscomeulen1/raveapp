import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventoItem = ({ evento }) => {
    const navigate = useNavigate();

    const handleEntradasVendidas = () => {
        navigate(`/entradas-vendidas/${evento.id}`);
    };

    const handleCancelClick = () => {
        navigate(`/cancelar-evento/${evento.id}`, { state: { nombre: evento.nombre } });
    };

    const handleModificarEvento = () => {
        navigate(`/modificar-evento/${evento.id}`, { state: { evento } });
    };

    const estadoColor = {
        "vigente": "text-green-600",
        "pendiente": "text-purple-600",
        "finalizado": "text-red-600"
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {/* Sección Izquierda: estado + "imagen" + días + nombre */}
            <div className="flex items-center">
                <div>
                    <span className={`font-semibold text-xl mr-6 ${estadoColor[evento.estado]}`}>
                        {evento.estado}
                    </span>
                </div>
                <div className="w-16 h-16 bg-gray-300 flex items-center justify-center">
                    <span>Img</span>
                </div>
                <div className="ml-4">
                    <p className="text-lg font-semibold">{evento.nombre}</p>
                    {/* Muestra cada día con su fecha y horario */}
                    {evento.dias.map((dia, index) => (
                        <p key={index} className="text-gray-600">
                            {dia.fecha} | {dia.horaInicio} - {dia.horaFin}
                        </p>
                    ))}
                </div>
            </div>

            {/* Sección Derecha: botones según estado */}
            <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
                {evento.estado === "vigente" && (
                    <>
                        <button
                            className="btn btn-info w-full md:w-auto"
                            onClick={handleEntradasVendidas}
                        >
                            Entradas vendidas
                        </button>
                        <button
                            className="btn btn-primary w-full md:w-auto"
                            onClick={handleModificarEvento}
                        >
                            Modificar
                        </button>
                        <button
                            className="btn btn-error w-full md:w-auto"
                            onClick={handleCancelClick}
                        >
                            Cancelar evento
                        </button>
                    </>
                )}

                {evento.estado === "pendiente" && (
                    <>
                        <button
                            className="btn btn-primary w-full md:w-auto"
                            onClick={handleModificarEvento}
                        >
                            Modificar
                        </button>
                        <button
                            className="btn btn-error w-full md:w-auto"
                            onClick={handleCancelClick}
                        >
                            Cancelar evento
                        </button>
                    </>
                )}

                {evento.estado === "finalizado" && (
                    <button
                        className="btn btn-info w-full md:w-auto"
                        onClick={handleEntradasVendidas}
                    >
                        Entradas vendidas
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventoItem;



// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const EventoItem = ({ evento }) => {

//     const navigate = useNavigate();

//     const handleEntradasVendidas = () => {
//         navigate(`/entradas-vendidas/${evento.id}`);
//     };

//     const handleCancelClick = () => {
//         navigate(`/cancelar-evento/${evento.id}`, { state: { nombre: evento.nombre } });
//     };

//     const handleModificarEvento = () => {
//         navigate(`/modificar-evento/${evento.id}`, { state: { evento } }); // Aquí pasas el evento completo
//     };

//     const estadoColor = {
//         "vigente": "text-green-600",
//         "pendiente": "text-purple-600",
//         "finalizado": "text-red-600"
//     };

//     return (
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//             <div className="flex items-center">
//                 <div>
//                     <span className={`font-semibold text-xl mr-6 ${estadoColor[evento.estado]}`}>{evento.estado}</span>
//                 </div>
//                 <div className="w-16 h-16 bg-gray-300 flex items-center justify-center">
//                     <span>Img</span>
//                 </div>
//                 <div className="ml-4">
//                     <p className="text-gray-600">{evento.fecha}</p>
//                     <p className="text-lg font-semibold">{evento.nombre}</p>
//                 </div>
//             </div>
//             <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0">
//                 {evento.estado === "vigente" && (
//                     <>
//                         <button className="btn btn-info w-full md:w-auto" onClick={handleEntradasVendidas}>Entradas vendidas</button>
//                         <button className="btn btn-primary w-full md:w-auto" onClick={handleModificarEvento}>Modificar</button>
//                         <button className="btn btn-error w-full md:w-auto" onClick={handleCancelClick}>Cancelar evento</button>
//                     </>
//                 )}

//                 {evento.estado === "pendiente" && (
//                     <>
//                         <button className="btn btn-primary w-full md:w-auto" onClick={handleModificarEvento}>Modificar</button>
//                         <button className="btn btn-error w-full md:w-auto" onClick={handleCancelClick}>Cancelar evento</button>
//                     </>
//                 )}

//                 {evento.estado === "finalizado" && (
//                     <button className="btn btn-info w-full md:w-auto" onClick={handleEntradasVendidas}>Entradas vendidas</button>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default EventoItem;