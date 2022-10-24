import '../index.css';
import { Link } from 'react-router-dom';
export default function Card() {
    return (
        <div className="p-5 inline-flex">
            <Link className="card w-96 bg-base-100 shadow-xl" to='/evento'>
                <figure><img src="https://t3.ftcdn.net/jpg/02/87/35/70/240_F_287357045_Ib0oYOxhotdjOEHi0vkggpZTQCsz0r19.jpg" alt="Joda" /></figure>
                <div className="card-body">
                    <h2 className="card-title">
                        Evento de electronica
                        <div className="badge badge-secondary">NEW</div>
                    </h2>
                    <p >10/10/2020</p>
                    <div className="card-actions justify-end">
                        <div className="badge badge-outline">Techno</div>
                        <div className="badge badge-outline">LGBT</div>
                    </div>
                </div>
            </Link>
        </div>
    );
};