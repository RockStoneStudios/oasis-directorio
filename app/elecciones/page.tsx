'use client';

import React from 'react';
import { ArrowRight, MapPin, Vote, ExternalLink, ShieldAlert, AlertTriangle, Building2 } from "lucide-react";

const PUESTOS_SOPETRAN = [
  {
    title: "Coliseo Municipal - Sector Aguamala",
    type: "Urbano",
    desc: "Sede principal en el casco urbano del municipio. Ideal para votantes de sectores aledaños a Aguamala. 🏟️",
    address: "Sector Aguamala, Sopetrán",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=6.503059,-75.747941"
  },
  {
    title: "SD Córdoba",
    type: "Urbano / Rural",
    desc: "Puesto de votación en la sede educativa Córdoba. Fácil acceso para la comunidad local. 🏫",
    address: "Vereda Córdoba, Sopetrán",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=6.518546,-75.769370"
  },
  {
    title: "SD Guayabal",
    type: "Rural",
    desc: "Sede habilitada para facilitar el sufragio de la gran comunidad veredal de Guayabal. 📍",
    address: "Vereda Guayabal, Sopetrán",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=6.4720,-75.7380"
  },
  {
    title: "SD Horizontes",
    type: "Rural",
    desc: "Mesa disponible para asegurar el derecho al voto de los habitantes del corregimiento Horizontes. 🏔️",
    address: "Vereda Horizontes, Sopetrán",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=6.5200,-75.7700"
  },
  {
    title: "SD Montegrande",
    type: "Rural",
    desc: "Puesto de cobertura rural para garantizar el derecho al sufragio en el sector de Montegrande. 🌾",
    address: "Vereda Montegrande, Sopetrán",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=6.4880,-78.7820"
  },
  {
    title: "SD Nuevo Horizonte",
    type: "Rural",
    desc: "Sede dispuesta para la excelente atención de la población electoral de la zona de Nuevo Horizonte. 🌅",
    address: "Vereda Nuevo Horizonte, Sopetrán",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=6.5150,-75.7350"
  },
  {
    title: "SD San Nicolás",
    type: "Rural",
    desc: "Puesto electoral ubicado estratégicamente en la vereda San Nicolás para toda la comunidad vecina. 🗺️",
    address: "Vereda San Nicolás, Sopetrán",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=6.5300,-75.7450"
  }
];

export default function EleccionesPage() {
  const handleVerificacionElectoral = () => {
    window.open('https://wapp.registraduria.gov.co/censo/consultar', '_blank');
  };

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "Consulta de Puestos de Votación en Sopetrán, San Jerónimo y Occidente 2026",
    "provider": {
      "@type": "GovernmentOrganization",
      "name": "Registraduría Nacional del Estado Civil",
      "address": "Occidente Antioqueño, Colombia"
    },
    "serviceOperator": {
      "@type": "LocalBusiness",
      "name": "Oasis | Directorio de Negocios Locales",
      "description": "La plataforma digital y guía comercial definitiva del Occidente Antioqueño."
    },
    "description": "Guía completa de puestos de votación, elecciones y movilidad en Sopetrán y el Occidente de Antioquia.",
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Sopetrán" },
      { "@type": "AdministrativeArea", "name": "San Jerónimo" },
      { "@type": "AdministrativeArea", "name": "Santa Fe de Antioquia" }
    ],
    "hasPart": PUESTOS_SOPETRAN.map((puesto) => ({
      "@type": "Place",
      "name": puesto.title,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": puesto.address,
        "addressLocality": "Sopetrán",
        "addressRegion": "Antioquia",
        "addressCountry": "CO"
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 overflow-x-hidden font-sans relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* SECCIÓN HERO */}
      <main className="relative z-10 pt-20 pb-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Contenido Izquierdo */}
          <div className="text-center lg:text-left space-y-8 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest">
              <Vote className="w-4 h-4" /> 🗳️ Servicio Electoral Ciudadano del Occidente
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-tight text-white">
              Puestos de Votación <br />
              <span className="text-orange-500">en Sopetrán 2026</span>
            </h1>
            <p className="text-slate-200 text-xl max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              ¿Votas en Sopetrán, San Jerónimo, Santa Fe de Antioquia o zonas rurales del Occidente? Centralizamos las herramientas oficiales y mapas interactivos de la Registraduría para que encuentres tu mesa rápidamente con Oasis. 🇨🇴
            </p>
          </div>
          
          {/* Contenido Derecho (Botón de Acción) */}
          <div className="relative flex items-center justify-center flex-1 w-full max-w-md mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative w-full">
              <div className="p-8 md:p-10 bg-slate-900/40 rounded-[3rem] border border-white/10 backdrop-blur-md w-full relative z-10 flex flex-col justify-between min-h-[320px]">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                    🔍 Censo Electoral 2026
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Accede directamente al censo nacional unificado para validar tu puesto y evitar cualquier congestión de última hora este domingo de elecciones. 📊
                  </p>
                </div>
                
                <div className="relative w-full mt-auto">
                  <button 
                    onClick={handleVerificacionElectoral}
                    className="relative w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-2xl px-6 py-5 text-lg font-bold shadow-lg shadow-orange-900/20 active:scale-95 transition-all duration-150 inline-flex items-center justify-center group cursor-pointer border border-orange-500/30 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center tracking-tight">
                      ¡MIRA TU LUGAR DE VOTACIÓN AQUÍ! 🗳️
                      <ArrowRight className="ml-2 w-5 h-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* SECCIÓN ALERTA */}
      <section className="relative z-10 px-4 max-w-6xl mx-auto py-6">
        <div className="bg-gradient-to-br from-[#1e1b4b]/40 to-[#020617] rounded-[2.5rem] border border-red-500/20 p-6 md:p-8 overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="p-4 bg-red-500/10 w-fit rounded-2xl shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-black text-white">
                ⚠️ Alerta de Movilidad: Flujo Vehicular en el Occidente Antioqueño
              </h2>
              <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
                Se prevé alta congestión en las estaciones de servicio debido al transporte de votantes. Recomendamos desplazarse a pie en las zonas céntricas urbanas de Sopetrán y San Jerónimo o programar traslados con antelación. 🚗
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 blur-[60px] rounded-full pointer-events-none" />
        </div>
      </section>

      {/* CARDS DE PUESTOS */}
      <section className="relative z-10 px-4 max-w-6xl mx-auto py-12">
        <div className="flex items-center gap-3 mb-8 px-2">
          <MapPin className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl md:text-3xl font-black text-white">📍 Directorio Geolocalizado de Puestos de Votación</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PUESTOS_SOPETRAN.map((puesto, idx) => (
            <div 
              key={idx}
              className="bg-[#0f172a]/80 p-6 md:p-8 rounded-[2.5rem] border border-white/5 hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full justify-between group"
            >
              <div>
                <div className="mb-4">
                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    Sector {puesto.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-orange-400 transition-colors line-clamp-2">
                  {puesto.title}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-6">{puesto.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 gap-2">
                <span className="truncate pr-2 max-w-[140px] font-medium" title={puesto.address}>📍 {puesto.address}</span>
                <a 
                  href={puesto.mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white rounded-xl px-4 py-2.5 font-bold text-xs transition-all inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Ruta GPS 🗺️
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTINGENCIA */}
      <section className="relative z-10 px-4 max-w-6xl mx-auto py-12">
        <div className="bg-gradient-to-br from-slate-900 to-[#020617] rounded-[3rem] border border-orange-500/20 p-8 md:p-12 overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4" /> 🛡️ Contingencia del Censo Digital
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                ¿La plataforma de la Registraduría <span className="text-orange-400">está lenta?</span>
              </h2>
              <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                Ante saturaciones del servidor nacional, guarda una captura de pantalla de tu puesto con antelación o revisa las listas físicas impresas en los accesos de votación. 📲
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
        </div>
      </section>

      {/* ACCIÓN COMERCIAL */}
      <section className="relative z-20 px-4 max-w-4xl mx-auto pb-24 mt-12">
        <div className="bg-[#041624] rounded-[3rem] border border-white/10 p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              📈 ¿Tienes un comercio en el Occidente? <br />
              <span className="text-orange-400">¡Hazlo visible en Oasis!</span>
            </h2>
            <p className="text-slate-200 text-base mb-8 font-medium max-w-2xl mx-auto leading-relaxed">
              Conectamos la oferta comercial de Sopetrán, San Jerónimo y Santa Fe de Antioquia. ¡Asegura tu lugar en el directorio más visitado! 🚀
            </p>
            <div className="flex justify-center">
              <a href="https://wa.me/573206209817" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <button className="bg-[#10b981] hover:bg-[#059669] text-slate-100 font-black px-10 py-7 rounded-2xl text-xl w-full sm:w-auto shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter inline-flex items-center justify-center gap-2 cursor-pointer">
                  <Building2 className="w-6 h-6" /> 🚀 REGISTRAR MI NEGOCIO EN OASIS
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 bg-slate-950/50 text-center">
        <p className="text-slate-300 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase px-4">
          Oasis | Guía y Directorio Comercial de Negocios Locales © 2026 🌐
        </p>
      </footer>
    </div>
  );
}