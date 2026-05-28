'use client';

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Municipality {
  _id: string;
  name: string;
  slug: { current: string } | string;
}

interface HomeSearchProps {
  municipalities: Municipality[];
}

export function HomeSearch({ municipalities }: HomeSearchProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedMuniSlug, setSelectedMuniSlug] = useState("");

  useEffect(() => {
    // Sincroniza el input oculto con la URL actual controlada por el Navbar o el localStorage
    const urlMuni = searchParams.get("municipality");
    const savedMuni = urlMuni || localStorage.getItem("oasis_municipality");

    if (savedMuni) {
      const match = municipalities.find(m => {
        const slugStr = typeof m.slug === 'string' ? m.slug : m.slug?.current || "";
        return slugStr === savedMuni;
      });
      if (match) {
        setSelectedMuniSlug(savedMuni);
      }
    } else {
      setSelectedMuniSlug("");
    }
  }, [municipalities, searchParams]);

  return (
    <form
      action="/business"
      method="GET"
      className="mx-auto mt-10 flex max-w-2xl bg-card text-card-foreground p-2 rounded-full shadow-lg border border-border/60 backdrop-blur-md"
    >
      {/* Input único de búsqueda de texto expandido */}
      <div className="relative flex-1 flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
        <Input
          id="home-business-search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="¿Qué estás buscando? (Restaurantes, hoteles...)"
          className="h-12 pl-12 pr-4 text-base border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/70 w-full"
        />
      </div>

      {/* Input oculto que envía el municipio activo del ecosistema al backend de /business */}
      <input type="hidden" name="municipality" value={selectedMuniSlug} />

      <Button 
        type="submit" 
        size="xl" 
        className="h-12 rounded-full px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-md transition-colors"
      >
        Buscar
      </Button>
    </form>
  );
}