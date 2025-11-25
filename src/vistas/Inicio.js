import { useState, useEffect, useContext } from 'react';
import NavBar from '../components/NavBar';
import CardsEventos from '../components/CardsEventos';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import Buscador from "../components/Buscador";
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

function Inicio() {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [loading, setLoading] = useState(true);  // <-- Nuevo estado loading
  const [search, setSearch] = useState('');

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const generosResponse = await api.get('/Evento/GetGeneros');
        const generosArray = generosResponse.data;
        const generosDict = {};
        generosArray.forEach(gen => {
          generosDict[gen.cdGenero] = gen.dsGenero;
        });

        const eventosResponse = user
          ? await api.get(`/Evento/GetEventos?Estado=2&IdUsuarioFav=${user.id}`)
          : await api.get('/Evento/GetEventos?Estado=2');
        const eventosApi = eventosResponse.data.eventos;

        const eventosConMultimedia = await Promise.all(eventosApi.map(async (evento) => {
          let imagenUrl = null;
          let videoUrl = null;

          try {
            const mediaResponse = await api.get(`/Media?idEntidadMedia=${evento.idEvento}`);
            const mediaArray = mediaResponse.data.media || [];

            const imagen = mediaArray.find(m => m.mdVideo === null && m.url);
            if (imagen) {
              imagenUrl = imagen.url;
            }

            const video = mediaArray.find(m => m.mdVideo !== null && m.mdVideo);
            if (video) {
              videoUrl = video.mdVideo;
            }
          } catch (err) {
            console.warn(`No se pudo obtener media para evento ${evento.idEvento}`, err);
          }

          return {
            id: evento.idEvento,
            nombreEvento: evento.nombre,

            // 👉 CLAVES DE FECHA (para filtrar rápido por día)
            dateKeys: (evento.fechas || []).map(f => String(f.inicio).slice(0, 10)),

            dias: (evento.fechas || []).map(fecha => {
              const dInicio = new Date(fecha.inicio);
              const dFin = new Date(fecha.fin);
              return {
                idFecha: fecha.idFecha,

                // 👉 Guardamos también por si querés usar más adelante
                inicioDate: dInicio,
                finDate: dFin,
                dateKey: String(fecha.inicio).slice(0, 10),

                // textos para UI
                fecha: dInicio.toLocaleDateString('es-AR'),
                horaInicio: dInicio.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                horaFin: dFin.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                entradas: fecha.entradas || []
              };
            }),

            generos: evento.genero.map(genId => generosDict[genId] || 'Desconocido'),
            artistas: evento.artistas || [],
            lgbt: evento.isLgbt,
            after: evento.isAfter,
            provincia: evento.domicilio.provincia.nombre,
            municipio: evento.domicilio.municipio.nombre,
            localidad: evento.domicilio.localidad.nombre,
            direccion: evento.domicilio.direccion,
            descripcion: evento.descripcion,
            imagen: imagenUrl,
            youtube: videoUrl,
            soundcloud: evento.soundCloud,
            isFavorito: evento.isFavorito === 1
          };
        }));

        setEventos(eventosConMultimedia);
        setFilteredEventos(eventosConMultimedia);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [user]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredEventos(eventos);
    } else {
      const q = search.toLowerCase();
      const filtrados = eventos.filter(e =>
        e.nombreEvento.toLowerCase().includes(q)
      );
      setFilteredEventos(filtrados);
    }
  }, [search, eventos]);


  const filterEventos = (eventos, filtros = {}) => {
    const {
      genero,
      after,
      lgbt,
      ubicacion,
      fechaOption = 'todos',
      fechaEspecifica,
    } = filtros || {};

    // Helpers de fechas (todo por fecha-calendario sin hora)
    const toKey = (d) => {
      const x = new Date(d);
      // Ajuste a medianoche local
      x.setHours(0, 0, 0, 0);
      const y = x.getFullYear();
      const m = String(x.getMonth() + 1).padStart(2, '0');
      const day = String(x.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const addDays = (d, n) => {
      const x = new Date(d);
      x.setDate(x.getDate() + n);
      x.setHours(0, 0, 0, 0);
      return x;
    };

    // Semana actual: Lunes a Domingo
    const getThisWeekRangeKeys = (base = new Date()) => {
      const d = new Date(base);
      d.setHours(0, 0, 0, 0);
      const jsDay = d.getDay(); // 0=Dom..6=Sab
      const diffToMonday = (jsDay + 6) % 7; // Dom->6, Lun->0,...
      const monday = addDays(d, -diffToMonday);
      const keys = [];
      for (let i = 0; i < 7; i++) {
        keys.push(toKey(addDays(monday, i)));
      }
      return new Set(keys);
    };

    // Próximo fin de semana: Viernes a Domingo del siguiente finde
    const getNextWeekendKeys = (base = new Date()) => {
      const d = new Date(base);
      d.setHours(0, 0, 0, 0);
      const jsDay = d.getDay(); // 0=Dom..6=Sab
      let daysToNextFriday = (5 - jsDay + 7) % 7;
      if (daysToNextFriday === 0) daysToNextFriday = 7; // si hoy es viernes, tomo el siguiente
      const friday = addDays(d, daysToNextFriday);
      return new Set([
        toKey(friday),
        toKey(addDays(friday, 1)),
        toKey(addDays(friday, 2)),
      ]);
    };

    // Prepara el conjunto de días válidos según la opción
    let validDaysSet = null; // Set de YYYY-MM-DD
    if (fechaOption === 'especifica' && fechaEspecifica) {
      // El input date ya viene como 'YYYY-MM-DD', igual que event.dateKeys
      validDaysSet = new Set([fechaEspecifica]);
    } else if (fechaOption === 'estaSemana') {
      validDaysSet = getThisWeekRangeKeys(new Date());
    } else if (fechaOption === 'proximoFinDeSemana') {
      validDaysSet = getNextWeekendKeys(new Date());
    }

    return eventos.filter(evento => {
      // Género
      if (genero && genero !== 'Todos') {
        if (!evento.generos?.includes(genero)) return false;
      }
      // After / LGBT
      if (after && !evento.after) return false;
      if (lgbt && !evento.lgbt) return false;

      // Ubicación
      if (ubicacion) {
        const { provincia, municipio, localidad } = ubicacion;
        if (provincia && evento.provincia !== provincia) return false;
        if (municipio && evento.municipio !== municipio) return false;
        if (localidad && evento.localidad !== localidad) return false;
      }

      // Fecha
      if (validDaysSet) {
        const eventKeys = evento.dateKeys || [];
        const match = eventKeys.some(k => validDaysSet.has(k));
        if (!match) return false;
      }

      return true;
    });
  };


  const handleFilter = (filtros) => {
    const resultados = filterEventos(eventos, filtros);
    setFilteredEventos(resultados);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className='flex-1'>
        <div className='sm:px-10'>
          <NavBar onFilter={handleFilter} />
        </div>
        <div className='mx-3 sm:mx-9 md:mx-14 lg:mx-24'>
          <Carousel />

          {/* 🔍 Buscador de eventos */}
          <Buscador
            value={search}
            onChange={setSearch}
            placeholder="Buscar eventos..."
            className="max-w-3xl mx-auto mt-6 mb-1 px-2 sm:px-0"
          />

          {loading ? (
            <div className="flex-grow flex mt-10 items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full border-4 border-gray-200 border-b-gray-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando eventos...</p>
              </div>
            </div>
          ) : filteredEventos.length === 0 ? (
            <div className="text-center my-10">
              <p className="text-xl font-semibold">No hay eventos en venta en este momento.</p>
              <p className="text-gray-500">¡Vuelve pronto para descubrir nuevas fiestas!</p>
            </div>
          ) : (
            <CardsEventos eventos={filteredEventos} user={user} />
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Inicio;