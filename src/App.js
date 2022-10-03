import './index.css';
import NavBar from './components/NavBar';
import Card from './components/Card';
import Footer from './components/Footer';
import Login from './components/Login'
import Register from './components/Register'
import ButtonRepetance from './components/ButtonRepetance'

function App() {
  return (

    <div className='px-10 overflow-hidden'>
      <NavBar />
      <ButtonRepetance />
      <Footer />
    </div>


  );
}

export default App;
