import React from 'react'
import '../index.css';
import NavBar from '../components/NavBar';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';

function Inicio() {
  window.scrollTo(0, 0); // Establece el scroll en la parte superior de la página
  return (
    <div>
      <div className='px-10'>

        <NavBar />
        </div>
        <div className='mx-3 sm:mx-9 md:mx-14 lg:mx-24'>
        <Carousel />
        <Cards />
        </div>
      <Footer />
    </div>
  )
}

export default Inicio