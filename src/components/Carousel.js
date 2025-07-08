import React, { useEffect, useRef, useState } from 'react';
import api from '../componenteapi/api';

const idsCarousel = ['idCarousel1', 'idCarousel2', 'idCarousel3', 'idCarousel4'];

export default function Carousel() {
  const carouselRef = useRef(null);
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    const fetchImagenes = async () => {
      const nuevasImagenes = [];

      for (const id of idsCarousel) {
        try {
          const res = await api.get(`/Media?idEntidadMedia=${id}`);
          const url = res.data?.media?.[0]?.url || null;
          nuevasImagenes.push({ id, url });
        } catch {
          nuevasImagenes.push({ id, url: null });
        }
      }

      setImagenes(nuevasImagenes);
    };

    fetchImagenes();
  }, []);

  const goToSlide = (index) => {
    const slide = document.getElementById(`slide${index}`);
    if (slide && carouselRef.current) {
      carouselRef.current.scrollLeft = slide.offsetLeft;
    }
  };

  if (imagenes.every(img => !img.url)) {
    return (
      <div className="h-48 flex items-center justify-center bg-base-200 text-gray-500">
        No hay imágenes cargadas en el carrusel.
      </div>
    );
  }

  return (
    <div>
      <div
        ref={carouselRef}
        className="carousel w-full lg:w-5/6 h-48 mx-auto mb-6"
        style={{ overflowX: 'scroll', scrollSnapType: 'x mandatory' }}
      >
        {imagenes.map((img, index) => (
          <div key={img.id} id={`slide${index}`} className="carousel-item relative w-full">
            {img.url ? (
              <img src={img.url} alt={`carousel-${index + 1}`} className="w-full h-auto object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                Imagen no disponible
              </div>
            )}
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <button
                className="btn btn-circle"
                onClick={() => goToSlide((index - 1 + imagenes.length) % imagenes.length)}
              >
                ❮
              </button>
              <button
                className="btn btn-circle"
                onClick={() => goToSlide((index + 1) % imagenes.length)}
              >
                ❯
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



// import React, { useRef } from 'react';

// export default function Carousel() {
//     const carouselRef = useRef(null);

//     const goToSlide = (slideId) => {
//         const slide = document.getElementById(slideId);
//         if (slide) {
//             carouselRef.current.scrollLeft = slide.offsetLeft;
//         }
//     };

//     return (
//         <div>
//             <div ref={carouselRef} className="carousel w-full lg:w-5/6 h-48 mx-auto mb-6" style={{ overflowX: 'scroll', scrollSnapType: 'x mandatory' }}>
//                 <div id="slide1" className="carousel-item relative w-full">
//                     <img src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp" alt="img" className="w-full h-auto object-cover" />
//                     <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//                         <button className="btn btn-circle" onClick={() => goToSlide('slide4')}>❮</button>
//                         <button className="btn btn-circle" onClick={() => goToSlide('slide2')}>❯</button>
//                     </div>
//                 </div>
//                 <div id="slide2" className="carousel-item relative w-full">
//                     <img src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp" alt="img" className="w-full h-auto object-cover" />
//                     <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//                         <button className="btn btn-circle" onClick={() => goToSlide('slide1')}>❮</button>
//                         <button className="btn btn-circle" onClick={() => goToSlide('slide3')}>❯</button>
//                     </div>
//                 </div>
//                 <div id="slide3" className="carousel-item relative w-full">
//                     <img src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp" alt="img" className="w-full h-auto object-cover" />
//                     <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//                         <button className="btn btn-circle" onClick={() => goToSlide('slide2')}>❮</button>
//                         <button className="btn btn-circle" onClick={() => goToSlide('slide4')}>❯</button>
//                     </div>
//                 </div>
//                 <div id="slide4" className="carousel-item relative w-full">
//                     <img src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp" alt="img" className="w-full h-auto object-cover" />
//                     <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//                         <button className="btn btn-circle" onClick={() => goToSlide('slide3')}>❮</button>
//                         <button className="btn btn-circle" onClick={() => goToSlide('slide1')}>❯</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }