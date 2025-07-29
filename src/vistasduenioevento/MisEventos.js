import React, { useEffect, useState, useContext } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import EventoItem from '../components/EventoItem';
import api from '../componenteapi/api';
import { AuthContext } from '../context/AuthContext';

const MisEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [estadosEvento, setEstadosEvento] = useState([]);
  const [orden, setOrden] = useState('asc');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventosRes = await api.get('/Evento/GetEventos', {
          params: { IdUsuario: user.id },
        });
        const estadosRes = await api.get('/Evento/GetEstadosEvento');

        setEventos(eventosRes.data.eventos || []);
        setEstadosEvento(estadosRes.data || []);
      } catch (error) {
        console.error('Error al cargar los eventos o estados:', error);
      }
    };

    if (user?.id) fetchData();
  }, [user]);

  const getEarliestDate = (evento) => {
    const fechas = evento.fechas.map(f => new Date(f.inicio));
    return new Date(Math.min(...fechas));
  };

  const ordenarEventos = (listaEventos, orden) => {
    return [...listaEventos].sort((a, b) => {
      const earliestA = getEarliestDate(a);
      const earliestB = getEarliestDate(b);
      return orden === 'asc' ? earliestA - earliestB : earliestB - earliestA;
    });
  };

  const getEstadoTexto = (cdEstado) => {
    const estado = estadosEvento.find(e => e.cdEstado === cdEstado);
    return estado ? estado.dsEstado : 'Desconocido';
  };

  const eventosFiltrados = ordenarEventos(
    eventos.filter(evento => {
      const nombreMatch = evento.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const estadoMatch = filtroEstado === 'todos' || evento.cdEstado === parseInt(filtroEstado);
      return nombreMatch && estadoMatch;
    }),
    orden
  );

  return (
    <div className="flex flex-col min-h-screen sm:px-10">
      <div className="flex-1">
        <NavBar />
        <div className="container mx-auto">
          <h1 className="mb-8 mt-2 px-4 text-3xl font-bold underline underline-offset-8">
            Mis eventos:
          </h1>

          <div className="mb-4 px-4 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <select
              className="select select-bordered"
              value={orden}
              onChange={e => setOrden(e.target.value)}
            >
              <option value="asc">Ordenar por fecha (ascendente)</option>
              <option value="desc">Ordenar por fecha (descendente)</option>
            </select>

            <select
              className="select select-bordered"
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos</option>
              {estadosEvento.map(estado => (
                <option key={estado.cdEstado} value={estado.cdEstado}>
                  {estado.dsEstado}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="input input-bordered"
              placeholder="Buscar evento..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {eventosFiltrados.map(evento => (
              <EventoItem
                key={evento.idEvento}
                evento={evento} // 👉 pasamos el objeto completo
                estadoTexto={getEstadoTexto(evento.cdEstado)} // 👉 para mostrar en UI
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MisEventos;
