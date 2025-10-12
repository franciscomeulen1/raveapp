import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
//import api from '../componenteapi/api';

export default function VerReporteDeVentas() {

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="sm:px-10 mb-11">
          <NavBar />
          
        </div>
      </div>
      <Footer />
    </div>
  );
};