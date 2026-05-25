// @/app/atm/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { client } from "@/lib/sanity/client"; 
import { DynamicAtmMapView } from "@/components/map/DynamicAtmMapView"; 
import { Landmark, CreditCard, MapPin, Club, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

// 🧮 Importamos tu función de distancia
import { calculateDistance } from "@/lib/utils-geo/distance";

const BANK_ICONS: Record<string, any> = {
  "bancolombia": CreditCard,
  "davivienda": Landmark,
  "banco_de_bogota": Landmark,
  "corresponsal": Landmark,
  "gana": Club
};

const BANK_BASE_COLORS: Record<string, string> = {
  "bancolombia": "bg-yellow-800 text-white hover:bg-yellow-700",
  "gana": "bg-green-600 text-white hover:bg-green-500",
  "default": "bg-emerald-600 text-white hover:bg-emerald-500"
};

const BANK_UNSELECTED_COLORS: Record<string, string> = {
  "bancolombia": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "gana": "bg-green-100 text-green-700 hover:bg-green-200",
  "default": "bg-muted text-muted-foreground hover:bg-muted/80"
};

// 🎯 COORDENADAS MAESTRAS (Eje del Parque Principal de Sopetrán)
const SOPETRAN_PARQUE_LAT = 6.50208;
const SOPETRAN_PARQUE_LNG = -75.74246;

async function getAtms() {
  const query = `*[_type == "atm"] {
    _id,
    title,
    location,
    recommendation,
    bankName,
    is24Hours,
    address {
      street,
      neighborhood,
      directionDetails
    }
  }`;
  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Error cargando cajeros:", error);
    return [];
  }
}

export default function AtmMapaPage() {
  const router = useRouter();
  const [allAtms, setAllAtms] = useState<any[]>([]);
  const [filteredAtms, setFilteredAtms] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null); 
  const [loading, setLoading] = useState(true);

  // Carga inicial y adaptación de datos de Sanity
  useEffect(() => {
    async function fetchMapData() {
      try {
        const atmsData = await getAtms();

        const adaptedAtms = atmsData.map((atm: any) => ({
          ...atm,
          name: atm.title,
          location: {
            lat: atm.location?.lat,
            lng: atm.location?.lng,
          },
          addressLabel: atm.address 
            ? `${atm.address.street || ""} ${atm.address.neighborhood || ""}`.trim() 
            : "Dirección no especificada"
        }));

        setAllAtms(adaptedAtms);
        setFilteredAtms(adaptedAtms);
      } catch (error) {
        console.error("Error cargando cajeros para el mapa:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMapData();
  }, []);

  // 🔥 NUEVA FUNCIÓN MAESTRA: Aplica ambos filtros combinados de forma reactiva
  const applyFilters = (bank: string | null, radius: number | null) => {
    let result = [...allAtms];

    // 1. Filtrar por Banco si aplica
    if (bank) {
      result = result.filter(
        (atm) => atm.bankName?.toLowerCase() === bank.toLowerCase()
      );
    }

    // 2. Filtrar por Distancia usando tu función calculateDistance si aplica
    if (radius !== null) {
      result = result.filter((atm) => {
        const lat = atm.location?.lat;
        const lng = atm.location?.lng;
        if (!lat || !lng) return false;

        const distance = calculateDistance(
          SOPETRAN_PARQUE_LAT,
          SOPETRAN_PARQUE_LNG,
          lat,
          lng
        );
        return distance <= radius;
      });
    }

    setFilteredAtms(result);
  };

  // Manejadores de clicks actualizados pasándole los estados correctos a applyFilters
  const handleBankSelect = (bankValue: string) => {
    const nextBank = selectedBank === bankValue ? null : bankValue;
    setSelectedBank(nextBank);
    applyFilters(nextBank, selectedRadius);
  };

  const handleRadiusSelect = (radiusKm: number | null) => {
    setSelectedRadius(radiusKm);
    applyFilters(selectedBank, radiusKm);
  };

  const handleResetAll = () => {
    setSelectedBank(null);
    setSelectedRadius(null);
    setFilteredAtms(allAtms);
  };

  const getButtonColor = (bank: string, isSelected: boolean) => {
    const bankKey = bank.toLowerCase();
    if (isSelected) {
      return BANK_BASE_COLORS[bankKey] || BANK_BASE_COLORS.default;
    } else {
      return BANK_UNSELECTED_COLORS[bankKey] || "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  const banksAvailable = Array.from(
    new Set(allAtms.map((atm) => atm.bankName).filter(Boolean))
  ) as string[];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="border-b border-border/50 bg-background px-4 py-3 shrink-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <Landmark className="h-5 w-5" />
            <h1 className="text-base font-bold font-heading text-foreground">Oasis | Cajeros y Retiros</h1>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-600 font-medium px-2.5 py-1 rounded-full">
            {filteredAtms.length} ubicados
          </span>
        </div>
      </header>

     <main className="flex-1 relative w-full h-[calc(100vh-120px)] min-h-0">
        {!loading && (
          <>
            {/* ⬅️ Botón Flotante Volver Atrás */}
           <button
  onClick={() => router.back()}
  className="absolute top-4 left-4 z-30 flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 cursor-pointer active:scale-95 pointer-events-auto
    /* ☀️ Modo Claro: Fondo blanco/80, texto gris oscuro, borde sutil y neón suave al pasar el mouse */
    bg-white/80 border border-emerald-100 text-zinc-800 shadow-[0_0_10px_rgba(16,185,129,0.1)] 
    hover:bg-white hover:text-emerald-600 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]
    
    /* 🌙 Modo Oscuro (dark:): Fondo zinc-900/80, borde oscuro, y neón esmeralda vibrante en hover */
    dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-200 dark:shadow-[0_0_15px_rgba(16,185,129,0.05)]
    dark:hover:bg-zinc-900 dark:hover:text-emerald-400 dark:hover:border-emerald-500 dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]"
  title="Volver atrás"
>
  <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
</button>

            <div className="absolute top-4 inset-x-0 z-10 flex flex-col items-center gap-2 px-4 pointer-events-none">
              {/* Fila 1: Filtros de Banco */}
              {banksAvailable.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar pointer-events-auto bg-background/60 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-border/40">
                  <button
                    onClick={() => { setSelectedBank(null); applyFilters(null, selectedRadius); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      selectedBank === null ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Todos
                  </button>
                  {banksAvailable.map((bank) => {
                    const isSelected = selectedBank === bank;
                    const IconComponent = BANK_ICONS[bank.toLowerCase()] || Landmark;
                    const buttonColor = getButtonColor(bank, isSelected);
                    
                    const bankLabels: Record<string, string> = {
                      bancolombia: "Bancolombia",
                      davivienda: "Davivienda",
                      banco_de_bogota: "Banco de Bogotá",
                      corresponsal: "Efecty / Gana",
                      gana: "Gana Colombia"
                    };

                    return (
                      <button
                        key={bank}
                        onClick={() => handleBankSelect(bank)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          buttonColor
                        } ${isSelected ? "shadow-sm scale-105 ring-2 ring-offset-1 ring-emerald-400" : ""}`}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                        {bankLabels[bank.toLowerCase()] || bank}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Fila 2: Filtros de Distancia */}
              <div className="flex gap-1.5 overflow-x-auto pointer-events-auto bg-background/80 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-border/30 text-[11px]">
                <button
                  onClick={() => handleRadiusSelect(null)}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    selectedRadius === null ? "bg-emerald-600 text-white font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Cualquier distancia
                </button>
                <button
                  onClick={() => handleRadiusSelect(0.5)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    selectedRadius === 0.5 ? "bg-emerald-600 text-white font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapPin className="h-3 w-3" /> a menos de 500m
                </button>
                <button
                  onClick={() => handleRadiusSelect(1.0)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    selectedRadius === 1.0 ? "bg-emerald-600 text-white font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapPin className="h-3 w-3" /> a menos de 1km
                </button>
              </div>
            </div>
          </>
        )}

        <div className="w-full h-full z-0">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50">
              <Landmark className="h-10 w-10 text-emerald-600 animate-pulse mb-2" />
              <p className="text-sm text-muted-foreground animate-pulse">Cargando mapa de cajeros...</p>
            </div>
          ) : filteredAtms.length > 0 ? (
            /* 🚀 Aquí renderizamos el mapa limpio de la entrega anterior pasándole la variable filtrada */
            <DynamicAtmMapView atms={filteredAtms} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <Landmark className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-lg font-semibold">No se encontraron cajeros en este rango</h2>
              <button 
                onClick={handleResetAll}
                className="mt-2 text-xs text-emerald-600 font-bold underline cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}