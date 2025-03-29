import React, { useState } from 'react';

const InputAfterOLbgt = () => {

    const [esAfter, setEsAfter] = useState(false);
    const [esLGBT, setEsLGBT] = useState(false);

    return (
        <div>
            <div className='form-control mb-2'>
                <label className='flex justify-start'>
                    <span className='label-text mr-2 font-bold text-lg'>Es after? </span>
                    <input
                        type="checkbox"
                        checked={esAfter}
                        className="checkbox checkbox-secondary"
                        onChange={() => setEsAfter(!esAfter)}
                    />
                </label>
            </div>

            <div className='form-control'>
                <label className="flex justify-start">
                    <span className='label-text mr-2 font-bold text-lg'>Es LGBT? </span>
                    <input
                        type="checkbox"
                        checked={esLGBT}
                        className="checkbox checkbox-secondary"
                        onChange={() => setEsLGBT(!esLGBT)}
                    />
                </label>
            </div>
        </div>
    );
};

export default InputAfterOLbgt;