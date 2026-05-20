// @/app/atm/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { client } from "@/lib/sanity/client"; 
import { DynamicAtmMapView } from "@/components/map/DynamicAtmMapView"; 
import { Landmark, CreditCard, MapPin } from "lucide-react";

const BANK_ICONS: Record<string, any> = {
  "bancolombia": CreditCard,
  "davivienda": Landmark,
  "banco_de_bogota": Landmark,
  "corresponsal": Landmark, 
};

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
  const [allAtms, setAllAtms] = useState<any[]>([]);
  const [filteredAtms, setFilteredAtms] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null); 
  const [loading, setLoading] = useState(true);

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
        // 🚀 PASA DIRECTO: Ya no filtramos por distancia al arrancar, muestra todo lo que traiga Sanity
        setFilteredAtms(adaptedAtms);
      } catch (error) {
        console.error("Error cargando cajeros para el mapa:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMapData();
  }, []);

  // Función optimizada: Ahora solo filtra por banco
  const applyFilters = (bank: string | null) => {
    let result = [...allAtms];

    if (bank) {
      result = result.filter(
        (atm) => atm.bankName?.toLowerCase() === bank.toLowerCase()
      );
    }

    // 🚀 La distancia ya no interviene para nada aquí
    setFilteredAtms(result);
  };

  const handleBankSelect = (bankValue: string) => {
    const nextBank = selectedBank === bankValue ? null : bankValue;
    setSelectedBank(nextBank);
    applyFilters(nextBank);
  };

  // Los botones de distancia ahora son puramente estéticos por el momento
  const handleRadiusSelect = (radiusKm: number | null) => {
    setSelectedRadius(radiusKm);
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
          <div className="absolute top-4 inset-x-0 z-10 flex flex-col items-center gap-2 px-4 pointer-events-none">
            {banksAvailable.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar pointer-events-auto bg-background/60 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-border/40">
                <button
                  onClick={() => { setSelectedBank(null); applyFilters(null); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedBank === null ? "bg-emerald-600 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Todos
                </button>
                {banksAvailable.map((bank) => {
                  const isSelected = selectedBank === bank;
                  const IconComponent = BANK_ICONS[bank.toLowerCase()] || Landmark;
                  
                  const bankLabels: Record<string, string> = {
                    bancolombia: "Bancolombia",
                    davivienda: "Davivienda",
                    banco_de_bogota: "Banco de Bogotá",
                    corresponsal: "Efecty / Gana"
                  };

                  return (
                    <button
                      key={bank}
                      onClick={() => handleBankSelect(bank)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        isSelected ? "bg-emerald-600 text-white shadow-sm scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                      {bankLabels[bank.toLowerCase()] || bank}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex gap-1.5 overflow-x-auto pointer-events-auto bg-background/80 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-border/30 text-[11px]">
              <button
                onClick={() => handleRadiusSelect(null)}
                className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedRadius === null ? "bg-secondary text-secondary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cualquier distancia
              </button>
              <button
                onClick={() => handleRadiusSelect(0.5)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedRadius === 0.5 ? "bg-secondary text-secondary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapPin className="h-3 w-3" /> a menos de 500m
              </button>
              <button
                onClick={() => handleRadiusSelect(1.0)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  selectedRadius === 1.0 ? "bg-secondary text-secondary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapPin className="h-3 w-3" /> a menos de 1km
              </button>
            </div>
          </div>
        )}

        <div className="w-full h-full z-0">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50">
              <Landmark className="h-10 w-10 text-emerald-600 animate-pulse mb-2" />
              <p className="text-sm text-muted-foreground animate-pulse">Cargando mapa de cajeros...</p>
            </div>
          ) : filteredAtms.length > 0 ? (
            <DynamicAtmMapView atms={filteredAtms} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <Landmark className="mb-4 h-12 w-12 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-lg font-semibold">No se encontraron cajeros registrados</h2>
              <button 
                onClick={() => { setSelectedBank(null); setSelectedRadius(null); applyFilters(null); }}
                className="mt-2 text-xs text-emerald-600 font-bold underline"
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