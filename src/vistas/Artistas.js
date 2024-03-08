import React from 'react'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import AvatarArtista from '../components/AvatarArtista';

export default function Artistas() {
    const artistas = [
        {
            id: 1,
            nombre: "Amelie Lens",
        }, {
            id: 2,
            nombre: "Charlotte de Wite",
        }, {
            id: 3,
            nombre: "99999999999",
        }, {
            id: 4,
            nombre: "T78",
        }, {
            id: 5,
            nombre: "Adam Beyer",
        }, {
            id: 5,
            nombre: "Boris Brejcha",
        }, {
            id: 6,
            nombre: "Regal",
        }, {
            id: 7,
            nombre: "Aly & Flia",
        }, {
            id: 8,
            nombre: "Anetha",
        }, {
            id: 9,
            nombre: "Armin Van Buuren",
        }, {
            id: 10,
            nombre: "Above & Beyond",
        }
    ]

    var listaNombres = [];
    artistas.forEach(e => {
        listaNombres.push(e.nombre);
    });
    //Agrupar por letra inicial o '#'. Me crea un array de objetos. Cada objeto tiene una clave/key que es la primer letra del nombre. Dentro de esa key pueden haber varios nombres de artistas. 
    const nombresAgrupados = listaNombres.reduce((result, nombre) => {
        const primeraLetra = /^[a-zA-Z]/.test(nombre) ? nombre[0].toUpperCase() : '#';
        // Asigna el nombre al grupo correspondiente en el objeto result.
        //Si el grupo aun no existe, se crea como un array vacio y luego se aniade el nombre.
        result[primeraLetra] = [...(result[primeraLetra] || []), nombre];
        return result;
    }, {});
    // Ordenar las claves alfabeticamente, pero que "#" aparezca primero.
    const clavesOrdenadas = Object.keys(nombresAgrupados).sort((a, b) => (a === '#' ? -1 : a.localeCompare(b)));
    
    //console.log(nombresAgrupados);
    // #: 
    // ['99999999999']
    // A: ['Amelie Lens', 'Adam Beyer', 'Aly & Flia', 'Anetha', 'Armin Van Buuren', 'Above & Beyond']
    // B: ['Boris Brejcha']
    // C: ['Charlotte de Wite']
    // R: ['Regal']
    // T: ['T78']


    return (
        <div>
            <div className="px-10 mb-11">
                <NavBar />
                <h1 className='px-10 mb-8 mt-2 text-3xl font-bold underline underline-offset-8'>Artistas</h1>
                <div className='mx-28'>

                    {clavesOrdenadas.map(letra => {
                        return <div key={letra}>
                            <div><p className='font-bold text-3xl'>{letra}</p></div>
                            <div class="grid grid-cols-4 gap-4 justify-items-center">
                                {nombresAgrupados[letra].map(nombre => (
                                    <AvatarArtista key={nombre} nombre={nombre} />
                                ))}
                            </div>
                            <div className="divider"></div>
                        </div>
                    })}

                    {/* CODIGO HARDCODEADO */}

                    {/* <div><p className='font-bold text-3xl'>#</p></div>
                    <div class="grid grid-cols-4 gap-4 justify-items-center">

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>
                    </div>

                    <div className="divider"></div>

                    <div><p className='font-bold text-3xl'>A</p></div>
                    <div class="grid grid-cols-4 gap-4 justify-items-center">


                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                        <Link className='grid justify-items-center' to='/artista'>
                            <div className="w-32">
                                <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="dj" className='rounded-full' />
                            </div>
                            <div><p className='font-bold'>Nombre del Artista</p></div>
                        </Link>

                    </div> */}
                </div>
            </div>
            <Footer />
        </div>
    )
}