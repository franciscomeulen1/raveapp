import React, { useRef } from 'react';

export default function Carousel() {
    const carouselRef = useRef(null);

    const goToSlide = (slideId) => {
        const slide = document.getElementById(slideId);
        if (slide) {
            carouselRef.current.scrollLeft = slide.offsetLeft;
        }
    };

    return (
        <div>
            <div ref={carouselRef} className="carousel w-full lg:w-5/6 h-48 mx-auto mb-6" style={{ overflowX: 'scroll', scrollSnapType: 'x mandatory' }}>
                <div id="slide1" className="carousel-item relative w-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" alt="img" className="w-full h-auto object-cover" />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <button className="btn btn-circle" onClick={() => goToSlide('slide4')}>❮</button>
                        <button className="btn btn-circle" onClick={() => goToSlide('slide2')}>❯</button>
                    </div>
                </div>
                <div id="slide2" className="carousel-item relative w-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.jpg" alt="img" className="w-full h-auto object-cover" />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <button className="btn btn-circle" onClick={() => goToSlide('slide1')}>❮</button>
                        <button className="btn btn-circle" onClick={() => goToSlide('slide3')}>❯</button>
                    </div>
                </div>
                <div id="slide3" className="carousel-item relative w-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.jpg" alt="img" className="w-full h-auto object-cover" />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <button className="btn btn-circle" onClick={() => goToSlide('slide2')}>❮</button>
                        <button className="btn btn-circle" onClick={() => goToSlide('slide4')}>❯</button>
                    </div>
                </div>
                <div id="slide4" className="carousel-item relative w-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg" alt="img" className="w-full h-auto object-cover" />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <button className="btn btn-circle" onClick={() => goToSlide('slide3')}>❮</button>
                        <button className="btn btn-circle" onClick={() => goToSlide('slide1')}>❯</button>
                    </div>
                </div>
            </div>
        </div>
    );
}



// export default function Carousel() {

//     const goToSlide = (slideId) => {
//         const slide = document.getElementById(slideId);
//         slide.scrollIntoView({ behavior: 'smooth' });
//     };

//     return (
//         <div className="carousel w-full lg:w-5/6 h-48 mx-auto mb-6">
//             <div id="slide1" className="carousel-item relative w-full">
//                 <img src="https://daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" alt="img" className="w-full h-auto object-cover" />
//                 <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//                     <button className="btn btn-circle" onClick={() => goToSlide('slide4')}>❮</button>
//                     <button className="btn btn-circle" onClick={() => goToSlide('slide2')}>❯</button>
//                 </div>
//             </div>
//             <div id="slide2" className="carousel-item relative w-full">
//                 <img src="https://daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.jpg" alt="img" className="w-full h-auto object-cover" />
//                 <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//                     <button className="btn btn-circle" onClick={() => goToSlide('slide1')}>❮</button>
//                     <button className="btn btn-circle" onClick={() => goToSlide('slide3')}>❯</button>
//                 </div>
//             </div>
//             <div id="slide3" className="carousel-item relative w-full">
//                 <img src="https://daisyui.com/images/stock/photo-1414694762283-acccc27bca85.jpg" alt="img" className="w-full h-auto object-cover" />
//                 <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//                     <button className="btn btn-circle" onClick={() => goToSlide('slide2')}>❮</button>
//                     <button className="btn btn-circle" onClick={() => goToSlide('slide4')}>❯</button>
//                 </div>
//             </div>
//             <div id="slide4" className="carousel-item relative w-full">
//                 <img src="https://daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg" alt="img" className="w-full h-auto object-cover" />
//                 <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//                     <button className="btn btn-circle" onClick={() => goToSlide('slide3')}>❮</button>
//                     <button className="btn btn-circle" onClick={() => goToSlide('slide1')}>❯</button>
//                 </div>
//             </div>
//         </div>
//     )
// }

