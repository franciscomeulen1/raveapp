import React from 'react'
import { Link } from 'react-router-dom';

export default function TablaDeEntradas(props) {

    const entradas = props.entradas;

    // Array de opciones de cantidad
    const cantidadOptions = [...Array(11).keys()]; // Genera un array de 0 a 10

    return (
        <div className="overflow-x-auto">
            <form action="#">
                <table className="table w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Ticket</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                    {entradas.map((entrada, index) => (
                            <tr key={index}>
                                <td>{entrada.tipo}</td>
                                <td>${entrada.precio}</td>
                                <td>
                                <select name={`cant-entrada-${index}`} className="select select-bordered w-full max-w-xs">
                                        {cantidadOptions.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Link className="flex justify-end my-3" to='/comprar'>
                    <button type="submit" className='btn btn-secondary'>Comprar</button>
                </Link>

            </form>

        </div>
    )
}


// CODIGO HARDCODEADO
// import React from 'react'
// import { Link } from 'react-router-dom';

// export default function TablaDeEntradas(props) {

//     const entradas = props.entradas;

//     return (
//         <div className="overflow-x-auto">
//             <form action="#">
//                 <table className="table w-full">
//                     {/* head */}
//                     <thead>
//                         <tr>
//                             <th>Ticket</th>
//                             <th>Precio</th>
//                             <th>Cantidad</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {/* <!-- row 1 --> */}
//                         <tr>
//                             <td>Entrada General - Early bird</td>
//                             <td>$1500</td>
//                             <td>
//                                 <select name="cant-entrada-earlybird" className="select select-bordered w-full max-w-xs">
//                                     <option selected>0</option>
//                                     <option>1</option>
//                                     <option>2</option>
//                                     <option>3</option>
//                                     <option>4</option>
//                                     <option>5</option>
//                                     <option>6</option>
//                                     <option>7</option>
//                                     <option>8</option>
//                                     <option>9</option>
//                                     <option>10</option>
//                                 </select>
//                             </td>
//                         </tr>
//                         {/* <!-- row 2 --> */}
//                         <tr>
//                             <td>Entrada General</td>
//                             <td>$2000</td>
//                             <td>
//                                 <select name="cant-entrada-general" className="select select-bordered w-full max-w-xs">
//                                     <option selected>0</option>
//                                     <option>1</option>
//                                     <option>2</option>
//                                     <option>3</option>
//                                     <option>4</option>
//                                     <option>5</option>
//                                     <option>6</option>
//                                     <option>7</option>
//                                     <option>8</option>
//                                     <option>9</option>
//                                     <option>10</option>
//                                 </select>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>

//                 <Link className="flex justify-end my-3" to='/comprar'>
//                     <button type="submit" className='btn btn-secondary'>Comprar</button>
//                 </Link>

//             </form>

//         </div>
//     )
// }


