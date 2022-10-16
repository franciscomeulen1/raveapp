import React from 'react'
import '../index.css';
import NavBar from '../components/NavBar';
import Card from '../components/Card';
import Footer from '../components/Footer';

function Inicio() {
  return (
    <div>
      <div className='px-10'>

        <NavBar />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      <Footer />
    </div>
  )
}

export default Inicio