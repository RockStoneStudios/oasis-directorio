import React from 'react';
import { Calendar, MapPin, Users, Church, Clock, ArrowRight, Info } from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS ---
const eventData = {
  title: "Fiestas Patronales",
  subtitle: "Nuestra Señora de la Asunción - Virgen Morena de Sopetrán",
  dateRange: "6 al 15 de agosto de 2026",
  location: "Sopetrán, Antioquia",
  description: "Programación oficial de las festividades en honor a la patrona del municipio. Te invitamos a participar en las actividades religiosas y culturales.",
};

// Programación día a día (Extraída de tus imágenes)
const schedule = [
  {
    day: "Jueves 6 de agosto",
    alferes: "Familia Parra Londoño",
    companions: "Institución Educativa Liceo José María Villa, Grupo de Catequistas, Grupo Lazos de Amor Mariano",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Rezo del Ángelus, repique de campanas" },
      { time: "06:00 p.m.", name: "Procesión con la imagen de la Virgen Morena de Sopetrán. Desde Villa Morena" },
      { time: "07:00 p.m.", name: "Santa Misa. Día Primero de la Novena y Salve" },
    ]
  },
  {
    day: "Viernes 7 de agosto",
    alferes: "Comercio Unido de Sopetrán",
    companions: "Policía Nacional, Comunidad Juvenil EMAUS, Infancia y Juventud Misionera",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Rezo del Ángelus, repique de campanas" },
      { time: "05:30 p.m.", name: "Caravana con la Imagen de la Virgen saliendo desde el Parque" },
      { time: "06:30 p.m.", name: "Santa Misa. Día Segundo de la Novena y Salve" },
    ]
  },
  {
    day: "Sábado 8 de agosto",
    alferes: "Yeison Paniagua y Dayana Montoya",
    companions: "Corregimiento Montegrande, Corregimiento de Guayabal, Grupo de Caridad de la Parroquia",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Rezo del Ángelus, repique de campanas" },
      { time: "05:00 p.m.", name: "Santa Misa en la Basílica" },
      { time: "05:00 p.m.", name: "Procesión con la imagen de la Virgen Morena desde el Sector La Bomba" },
      { time: "07:00 p.m.", name: "Santa Misa. Día Tercero de la Novena y Salve" },
    ]
  },
  {
    day: "Domingo 9 de agosto",
    alferes: "Luis Gabriel Lezcano, Juan Esteban Montealegre, Dra. Tatiana Alexandra Carballo Hoyos",
    companions: "Alcaldía Municipal, Vereda Guaymaral, Proclamadores de la Palabra, Edad Dorada",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "08:30 a.m.", name: "Santa Misa" },
      { time: "10:00 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Santa Misa" },
      { time: "05:00 p.m.", name: "Santa Misa" },
      { time: "06:00 p.m.", name: "Procesión con la imagen de la Virgen Morena desde el Sector La Capilla" },
      { time: "07:30 p.m.", name: "Santa Misa. Día Cuarto de la Novena y Salve" },
    ]
  },
    {
    day: "Lunes 10 de agosto",
    alferes: "Familia Araque Carrillo",
    companions: "Bomberos de Colombia. Familias de las Calles 11 y 12. Hijos del Sagrado Corazón de Jesús. Carmelo Misionero Seglar.",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Rezo del Ángelus, repique de campanas" },
      { time: "06:00 p.m.", name: "Procesión con la imagen de la Virgen Morena de Sopetrán desde la Capilla Sagrado Corazón de Jesús" },
      { time: "07:00 p.m.", name: "Santa Misa. Día Quinto de la Novena y Salve" },
    ]
  },
  {
    day: "Martes 11 de agosto",
    alferes: "Vereda Chagualal",
    companions: "Las familias y habitantes de la Vereda Chagualal",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Rezo del Ángelus, repique de campanas" },
      { time: "04:00 p.m.", name: "Santa Misa de María Auxiliadora en la Basílica" },
      { time: "05:00 p.m.", name: "Santa Misa en el Sector de Chagualal" },
      { time: "05:30 p.m.", name: "Procesión con la imagen de la Virgen Morena de Sopetrán, desde la vereda Chagualal" },
      { time: "07:30 p.m.", name: "Santa Misa. Día Sexto de la Novena y Salve" },
    ]
  },
  {
    day: "Miércoles 12 de agosto",
    alferes: "Luis Gabriel Giraldo Carvajal",
    companions: "Edad Dorada. Acólitos y Monaguillos de la parroquia",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Rezo del Ángelus, repique de campanas" },
      { time: "05:30 p.m.", name: "Procesión con la imagen de la Virgen Morena desde la sede de la Edad Dorada (Centro Vida)" },
      { time: "07:00 p.m.", name: "Santa Misa. Día Séptimo de la Novena y Salve" },
    ]
  },
  {
    day: "Jueves 13 de agosto",
    alferes: "Vereda El Rodeo",
    companions: "Familias y habitantes de la Comunidad Vereda El Rodeo. Institución Educativa Normal Superior Santa Teresita",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Rezo del Ángelus, repique de campanas" },
      { time: "05:00 p.m.", name: "Santa Misa en el Rodeo" },
      { time: "05:30 p.m.", name: "Procesión con la imagen de la Virgen Morena de Sopetrán, desde la vereda el Rodeo. Encuentro en el Parque Educativo" },
      { time: "07:00 p.m.", name: "Santa Misa. Día Octavo de la Novena y Salve" },
    ]
  },
  {
    day: "Viernes 14 de agosto",
    alferes: "Vereda La Miranda. Rafael Ortiz. Gloria Montoya. Teresa Acevedo",
    companions: "",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Rezo del Ángelus, repique de campanas" },
      { time: "05:00 p.m.", name: "Santa Misa en la Vereda La Miranda" },
      { time: "06:00 p.m.", name: "Procesión con la imagen de la Virgen Morena de Sopetrán, desde la vereda la Miranda. Encuentro en la Plaza de Toros" },
      { time: "07:00 p.m.", name: "Santa Misa. Día Noveno de la Novena y Salve" },
    ]
  },  {
    day: "Sábado 15 de agosto",
    alferes: "Vereda Llano de Montaña",
    companions: "Toda la Comunidad. Instituciones y familias de Sopetrán.",
    activities: [
      { time: "06:00 a.m.", name: "Rosario de Aurora" },
      { time: "06:30 a.m.", name: "Santa Misa" },
      { time: "12:00 m.", name: "Rezo del Ángelus, repique de campanas" },
      { time: "05:00 p.m.", name: "Santa Misa en la Basílica" },
      { time: "05:00 p.m.", name: "Santa Misa en el Monumento de la Virgen en el Llano de Montaña y Procesión con la imagen de la Virgen Morena de Sopetrán" },
      { time: "07:00 p.m.", name: "Santa Misa solemne en honor de la Virgen Morena de Sopetrán" },
    ]
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0e14] text-gray-200 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-[#161b22] to-[#0b0e14] border-b border-orange-900/30">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-900/20 border border-orange-500/30 text-orange-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Calendar className="w-3.5 h-3.5" />
            Evento Oficial 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-4 drop-shadow-lg">
            {eventData.title}
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">
            {eventData.subtitle}
          </p>
          <p className="text-orange-300/80 font-medium text-lg mb-2">
            {eventData.dateRange}
          </p>
          
          <div className="flex justify-center gap-6 flex-wrap mt-4 text-gray-400 text-sm">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {eventData.location}</span>
          </div>

          <p className="max-w-2xl mx-auto mt-6 text-gray-400 text-lg leading-relaxed">
            {eventData.description}
          </p>

          {/* Caja de Ooasys como en la imagen de referencia */}
          {/* 📄 BLOQUE DE TEXTO PARA GOOGLE (Palabras clave reales) */}
<section className="max-w-5xl mx-auto px-4 md:px-8 py-12">
  <div className="bg-[#161b22] p-8 rounded-2xl border border-gray-800 shadow-lg">
    <h2 className="text-3xl font-bold text-white mb-4 border-l-4 border-orange-500 pl-4">
      Tradición y Fe: La Virgen Morena de Sopetrán
    </h2>
    <div className="prose prose-lg prose-invert text-gray-300 space-y-4">
      <p>
        Las <strong>Fiestas Patronales de Sopetrán 2026</strong> son uno de los eventos 
        religiosos más esperados del Occidente Antioqueño. Del <strong>6 al 15 de agosto</strong>, 
        el municipio de Sopetrán se viste de gala para honrar a <strong>Nuestra Señora de la Asunción</strong>, 
        conocida cariñosamente por la comunidad como la <strong>Virgen Morena</strong>.
      </p>
      <p>
        Durante estos 10 días, la <strong>Basílica Menor Nuestra Señora de la Asunción</strong> 
        y las calles principales del pueblo serán el escenario de <strong>misas, novenas, 
        rosarios de aurora y procesiones</strong> que reúnen a miles de peregrinos, 
        turistas y devotos de todo el departamento de Antioquia y el país.
      </p>
      <p className="text-orange-300/80 font-medium">
        ✅ Todos los eventos son <strong>gratuitos</strong> y abiertos a todo el público. 
        ¡Te esperamos en Sopetrán para celebrar juntos esta hermosa tradición!
      </p>
    </div>
  </div>
</section>
        </div>
      </section>

      {/* --- SCHEDULE SECTION --- */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-orange-500 pl-4">
          Programación día por día
        </h2>

        <div className="grid gap-8">
          {schedule.map((daySchedule, index) => (
            <div 
              key={index} 
              className="bg-[#161b22] rounded-2xl border border-gray-800 overflow-hidden shadow-xl hover:border-orange-500/30 transition-colors duration-300"
            >
              {/* Header del día */}
              <div className="bg-gradient-to-r from-orange-900/20 to-[#161b22] p-6 border-b border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-orange-400">
                      {daySchedule.day}
                    </h3>
                    <div className="mt-2 text-sm text-gray-400">
                      <span className="font-medium text-orange-300">Alférez:</span> {daySchedule.alferes}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 px-4 py-2 rounded-full text-xs text-gray-300 flex items-center gap-2 border border-gray-700">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    {daySchedule.companions}
                  </div>
                </div>
              </div>

              {/* Lista de Actividades */}
              <div className="p-6">
                <div className="grid gap-2">
                  {daySchedule.activities.map((activity, i) => (
                    <div 
                      key={i} 
                      className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl bg-[#0e1219] hover:bg-[#1a2029] transition-colors border border-transparent hover:border-gray-700/50 group"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="min-w-[100px] sm:min-w-[110px] px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-xs font-bold text-center sm:text-left tracking-wide border border-orange-500/10">
                          {activity.time}
                        </div>
                        <span className="text-gray-100 font-medium text-sm sm:text-base group-hover:text-white transition-colors">
                          {activity.name}
                        </span>
                      </div>
                      <div className="ml-auto sm:ml-0">
                        <Clock className="w-4 h-4 text-gray-600 group-hover:text-orange-400 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-800 bg-[#0b0e14] text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Church className="w-5 h-5 text-orange-400" />
          <span className="text-gray-400 font-serif italic text-sm">Virgen Morena de Sopetrán</span>
        </div>
        <p className="text-gray-600 text-xs">
          Desarrollado para el directorio <span className="text-emerald-400">Ooasys</span> - Occidente Antioqueño
        </p>
      </footer>

    </main>
  );
}