import React from 'react'

export default function TablaDeEntradas() {
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
                        {/* <!-- row 1 --> */}
                        <tr>
                            <td>Entrada General - Early bird</td>
                            <td>$1500</td>
                            <td>
                                <select name="cant-entrada-earlybird" className="select select-bordered w-full max-w-xs">
                                    <option selected>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                </select>
                            </td>
                        </tr>
                        {/* <!-- row 2 --> */}
                        <tr>
                            <td>Entrada General</td>
                            <td>$2000</td>
                            <td>
                                <select name="cant-entrada-general" className="select select-bordered w-full max-w-xs">
                                    <option selected>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                    <option>7</option>
                                    <option>8</option>
                                    <option>9</option>
                                    <option>10</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex justify-end my-3">
                    <button type="submit" className='btn btn-secondary'>Comprar</button>
                </div>

            </form>

        </div>
    )
}


