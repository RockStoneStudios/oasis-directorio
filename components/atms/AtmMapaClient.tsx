'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DynamicAtmMapView } from "@/components/map/DynamicAtmMapView"; 
import { Landmark, CreditCard, MapPin, Club, ArrowLeft } from "lucide-react";
import { calculateDistance } from "@/lib/utils-geo/distance";

const SOPETRAN_PARQUE_LAT = 6.50208;
const SOPETRAN_PARQUE_LNG = -75.74246;

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

export default function AtmMapaClient({ initialAtms }: { initialAtms: any[] }) {
  const router = useRouter();
  const [allAtms] = useState(initialAtms);
  const [filteredAtms, setFilteredAtms] = useState(initialAtms);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number | null>(null);

  const applyFilters = (bank: string | null, radius: number | null) => {
    let result = [...allAtms];
    if (bank) {
      result = result.filter((atm) => atm.bankName?.toLowerCase() === bank.toLowerCase());
    }
    if (radius !== null) {
      result = result.filter((atm) => {
        const dist = calculateDistance(SOPETRAN_PARQUE_LAT, SOPETRAN_PARQUE_LNG, atm.location?.lat, atm.location?.lng);
        return dist <= radius;
      });
    }
    setFilteredAtms(result);
  };

  const banksAvailable = Array.from(new Set(allAtms.map((atm) => atm.bankName).filter(Boolean))) as string[];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="border-b border-border/50 bg-background px-4 py-3 shrink-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
            <h1 className="text-base font-bold text-foreground">Oasis | Cajeros y Retiros</h1>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full">{filteredAtms.length} ubicados</span>
        </div>
      </header>

      <main className="flex-1 relative w-full h-[calc(100vh-120px)]">
        <div className="absolute top-4 inset-x-0 z-10 flex flex-col items-center gap-2 px-4 pointer-events-none">
           {/* Filtros... (Usa el mismo código de filtros que tenías, todo funcionará igual) */}
        </div>
        
        <div className="w-full h-full z-0">
          <DynamicAtmMapView atms={filteredAtms} />
        </div>
      </main>
    </div>
  );
}