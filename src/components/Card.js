import '../index.css';
import { Link } from 'react-router-dom';

export default function Card(props) {

    return (
        <div className="p-5 inline-flex">
            <Link className="card w-96 bg-base-100 shadow-xl" to='/evento'>
                <figure><img src="https://t3.ftcdn.net/jpg/02/87/35/70/240_F_287357045_Ib0oYOxhotdjOEHi0vkggpZTQCsz0r19.jpg" alt="Joda" /></figure>
                <div className="card-body">
                    <h2 className="card-title">
                        {props.nombre}
                        {/* <div className="badge badge-secondary">NEW</div> */}
                    </h2>
                    <p >{props.fecha}</p>
                    <div className="card-actions justify-end">
                        {Array.isArray(props.generos) ? (
                            props.generos.map((g, index) => {
                                return <div key={index} className="badge badge-outline">{g}</div>
                            })
                        ) : (
                            <div className="badge badge-outline">{props.generos}</div>
                        )}
                        {props.lgbt === true && (
                            <div className="badge badge-outline">LGBT</div>
                        )}
                        
                    </div>
                </div>
            </Link>
        </div>
    );
};


// Componente hardcodeado

// <div className="p-5 inline-flex">
//     <Link className="card w-96 bg-base-100 shadow-xl" to='/evento'>
//         <figure><img src="https://t3.ftcdn.net/jpg/02/87/35/70/240_F_287357045_Ib0oYOxhotdjOEHi0vkggpZTQCsz0r19.jpg" alt="Joda" /></figure>
//         <div className="card-body">
//             <h2 className="card-title">
//                 Nombre del Evento
//                 <div className="badge badge-secondary">NEW</div>
//             </h2>
//             <p >{props.fecha}</p>
//             <div className="card-actions justify-end">
//                 <div className="badge badge-outline">Techno</div>
//                 <div className="badge badge-outline">LGBT</div>
//             </div>
//         </div>
//     </Link>
// </div>