// @/components/map/DynamicAtmMapView.tsx
'use client';

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Usando tu variable de entorno actual
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface DynamicAtmMapViewProps {
  atms: any[];
}

// 🎨 Colores específicos para cada banco
const BANK_COLORS: Record<string, {
  marker: string;
  header: string;
  headerGradient: string;
  accent: string;
  border: string;
  hintBg: string;
  hintText: string;
  hintBorder: string;
}> = {
  "bancolombia": {
    marker: "bg-yellow-600",
    header: "bg-yellow-700",
    headerGradient: "from-yellow-600 to-yellow-700",
    accent: "text-yellow-600",
    border: "border-yellow-200",
    hintBg: "bg-yellow-50",
    hintText: "text-yellow-800",
    hintBorder: "border-yellow-100"
  },
  "gana": {
    marker: "bg-green-600",
    header: "bg-green-600",
    headerGradient: "from-green-600 to-green-700",
    accent: "text-green-600",
    border: "border-green-200",
    hintBg: "bg-green-50",
    hintText: "text-green-800",
    hintBorder: "border-green-100"
  },
  "default": {
    marker: "bg-emerald-600",
    header: "bg-emerald-600",
    headerGradient: "from-emerald-600 to-emerald-700",
    accent: "text-emerald-600",
    border: "border-emerald-200",
    hintBg: "bg-emerald-50",
    hintText: "text-emerald-800",
    hintBorder: "border-emerald-100"
  }
};

// 📝 Textos de recomendación específicos por banco
const getBankHint = (bankName: string, defaultRecommendation?: string) => {
  const bankKey = bankName?.toLowerCase();
  
  if (bankKey === "bancolombia") {
    return "Ideal para retiros rápidos, sin necesidad de ingresar al parque principal.";
  }
  if (bankKey === "gana") {
    return "Ideal para chance, apuestas, retiros y pagos de servicios, sin necesidad de ingresar al parque principal.";
  }
  
  return defaultRecommendation || "Cajero disponible las 24 horas";
};

// 🏷️ Texto del subtítulo por banco
const getBankSubtitle = (bankName: string) => {
  const bankKey = bankName?.toLowerCase();
  
  if (bankKey === "bancolombia") {
    return "Cajero Bancolombia";
  }
  if (bankKey === "gana") {
    return "Gana Colombia";
  }
  
  return "Cajero Automático";
};

function AtmMapViewComponent({ atms }: DynamicAtmMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const currentPopupRef = useRef<mapboxgl.Popup | null>(null);

  // Función para cerrar cualquier popup abierto
  const closeAllPopups = () => {
    if (currentPopupRef.current) {
      currentPopupRef.current.remove();
      currentPopupRef.current = null;
    }
  };

  // 1. Inicialización del Mapa con Perspectiva 3D
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const defaultCenter: [number, number] = [6.500988, -75.742320];

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: defaultCenter,
        zoom: 14,
        pitch: 57,
        bearing: -16,
        antialias: true
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      mapRef.current = map;

      // Inyección de los edificios 3D
      map.on('style.load', () => {
        const layers = map.getStyle()?.layers;
        if (!layers) return;

        const labelLayer = layers.find(
          (layer) => layer.type === 'symbol' && layer.layout && (layer.layout as any)['text-field']
        );

        map.addLayer(
          {
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                14,
                0,
                15.05,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayer?.id
        );
      });

      // Cerrar popup al hacer clic en el mapa
      map.on('click', () => {
        closeAllPopups();
      });

    } catch (err) {
      console.error("❌ MAP ERROR - Error creando el objeto Mapbox:", err);
    }

    return () => {
      if (mapRef.current) {
        console.log("🗑️ MAP LOG - Destruyendo instancia del mapa");
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Renderizado de Marcadores con POPUPS MEJORADOS Y COLORES POR BANCO
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      console.log("⚠️ MAP LOG 2 - El mapa aún no está listo para recibir marcadores.");
      return;
    }

    console.log("🗺️ MAP LOG 3 - Recibiendo cajeros filtrados para pintar en el mapa:", atms);

    // Limpiamos marcadores previos
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    closeAllPopups();

    if (atms.length === 0) {
      console.log("⚠️ MAP LOG 4 - No llegaron cajeros a este useEffect. Arreglo vacío.");
      return;
    }

    atms.forEach((atm) => {
      const lng = atm.location?.lng;
      const lat = atm.location?.lat;

      if (!lng || !lat) return;

      try {
        // 🎨 Obtener colores según el banco
        const bankKey = atm.bankName?.toLowerCase();
        const colors = BANK_COLORS[bankKey] || BANK_COLORS.default;
        const bankHint = getBankHint(atm.bankName, atm.recommendation);
        const bankSubtitle = getBankSubtitle(atm.bankName);

        // 🎨 Crear elemento del marcador con color personalizado
        const el = document.createElement("div");
        el.className = `${colors.marker} text-white border-2 border-white rounded-full shadow-lg p-2 cursor-pointer flex items-center justify-center`;
        el.style.width = "38px";
        el.style.height = "38px";
        el.style.fontSize = "18px";
        el.innerHTML = "🏧";

        // 🎯 POPUP CON COLORES SEGÚN EL BANCO
        const popupHTML = `
          <div class="p-0 font-sans min-w-60 max-w-70">
            <!-- HEADER CON TÍTULO (color según banco) -->
            <div class="bg-linear-to-r ${colors.headerGradient} text-white rounded-t-lg px-3 py-2">
              <div class="flex items-center gap-2">
                <span class="text-lg">🏧</span>
                <div>
                  <h3 class="font-bold text-sm leading-tight">${atm.name}</h3>
                  <p class="text-[10px] text-white/90 opacity-90">${bankSubtitle}</p>
                </div>
              </div>
            </div>
            
            <!-- CONTENIDO -->
            <div class="p-3 bg-white rounded-b-lg">
              <!-- Horario 24H -->
              ${atm.is24Hours ? `
                <div class="flex items-center gap-1 mb-2 pb-1 border-b border-gray-100">
                  <span class="bg-green-100 text-green-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">🕒 24 HORAS</span>
                </div>
              ` : ''}
              
              <!-- Dirección -->
              <div class="mb-2">
                <p class="text-[12px] font-semibold text-gray-800 mb-0.5">📍 Ubicación</p>
                <p class="text-[12.5px] text-gray-800">${atm.addressLabel || 'Dirección no especificada'}</p>
                ${atm.address?.directionDetails ? `
                  <p class="text-[12.8px] text-gray-700 italic mt-0.5 flex items-start gap-1">
                    <span>📝</span>
                    <span>"${atm.address.directionDetails}"</span>
                  </p>
                ` : ''}
              </div>
              
              <!-- Recomendación/Hint específico del banco -->
              <div class="mt-2 pt-2 border-t ${colors.border}">
                <div class="flex items-start gap-1.5">
                  <span class="${colors.accent} text-xs">💡</span>
                  <div class="text-[12.4px] ${colors.hintBg} ${colors.hintText} p-2 rounded-lg border ${colors.hintBorder} italic flex-1">
                    ${bankHint}
                  </div>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="mt-2 pt-1 text-[9px] text-gray-400 text-center border-t border-gray-100">
                ${atm.bankName || 'Banco no especificado'}
              </div>
            </div>
          </div>
        `;

        // Crear el popup
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '280px',
          className: 'custom-atm-popup'
        }).setHTML(popupHTML);

        // Evento de clic en el marcador
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          closeAllPopups();
          popup.setLngLat([lng, lat]).addTo(map);
          currentPopupRef.current = popup;
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current.push(marker);
      } catch (markerError) {
        console.error(`❌ MAP ERROR - Falló la creación del pin para ${atm.name}:`, markerError);
      }
    });

    // Movimiento de cámara inicial
    if (atms.length > 0 && atms[0].location?.lng && atms[0].location?.lat) {
      map.flyTo({
        center: [atms[0].location.lng, atms[0].location.lat],
        zoom: 15.1,
        pitch: 55,
        duration: 2000,
        essential: true
      });
    }

    return () => {
      closeAllPopups();
    };

  }, [atms]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full min-h-100" />
      
      {/* Estilos globales para los popups */}
      <style jsx global>{`
        .custom-atm-popup .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }
        
        .custom-atm-popup .mapboxgl-popup-close-button {
          font-size: 16px !important;
          padding: 4px 8px !important;
          color: white !important;
          background: transparent !important;
          z-index: 10 !important;
        }
        
        .custom-atm-popup .mapboxgl-popup-close-button:hover {
          background: rgba(0,0,0,0.2) !important;
          border-radius: 0 8px 0 8px !important;
        }
        
        .custom-atm-popup .mapboxgl-popup-tip {
          border-top-color: #059669 !important;
        }
      `}</style>
    </div>
  );
}

export const DynamicAtmMapView = dynamic(() => Promise.resolve(AtmMapViewComponent), {
  ssr: false,
});