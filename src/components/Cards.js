import Card from '../components/Card';

export default function Cards() {
    
    const eventos = [
        {
            id: 1,
            nombreEvento: "Club 69 - Edicion CIRCUS",
            fecha: "10/05/2024",
            generos: ["Tech-House","Techno"],
            artistas: ["Dich Brothers", "La Cintia", "Luana"],
            lgbt: true,
            after: false
        },{
            id: 2,
            nombreEvento: "Under Club - UnderEdition",
            fecha: "15/05/2024",
            generos: "Tech-House",
            artistas: ["Nico Moreno", "T78"],
            lgbt: false,
            after: false
        },{
            id: 3,
            nombreEvento: "After El Sotano",
            fecha: "16/05/2024",
            generos: ["Tech-House","Techno"],
            artistas: ["Juan Solis", "Kilah"],
            lgbt: false,
            after: true
        },
        {
            id: 4,
            nombreEvento: "Rio Electronic Music",
            fecha: "20/05/2024",
            generos: "Tech-House",
            artistas: ["Dich Brothers", "La Cintia", "Luana"],
            lgbt: false,
            after: false
        },{
            id: 5,
            nombreEvento: "Cocoliche",
            fecha: "22/05/2024",
            generos: "Techno",
            artistas: ["Amelie Lens", "Regal", "Adam Beyer"],
            lgbt: false,
            after: false
        },{
            id: 6,
            nombreEvento: "The Magic",
            fecha: "22/05/2024",
            generos: "PsyTrance",
            artistas: "Javier Busola",
            lgbt: false,
            after: false
        },{
            id: 7,
            nombreEvento: "Target",
            fecha: "25/05/2024",
            generos: "Tech-House",
            artistas: ["Jay de Lys","Ghezz", "Cadelago"],
            lgbt: true,
            after: false
        },{
            id: 8,
            nombreEvento: "Kritical Techno",
            fecha: "30/05/2024",
            generos: "Techno",
            artistas: ["Enrico Sangiuliano","Josefina Munoz","999999999"],
            lgbt: false,
            after: false
        }
    ]

    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {eventos.map(evento => {
            return <Card key={evento.id} 
                         nombre={evento.nombreEvento}
                            fecha={evento.fecha}
                            generos={evento.generos}
                            lgbt={evento.lgbt}
                            after={evento.after}
                         />
        })}
            {/* <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
            <Card /> */}
        </div>
    )
}
