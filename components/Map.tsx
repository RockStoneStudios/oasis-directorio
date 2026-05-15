"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import MapGL, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GeoPoint } from "@/types";

interface MapProps {
  location?: GeoPoint | null;
  title?: string;
  address?: string;
}

export function Map({ location, title = "Ubicacion", address }: MapProps) {
  const [viewState, setViewState] = useState({
    longitude: location?.lng ?? -74.2973,
    latitude: location?.lat ?? 4.5709,
    zoom: 15,
  });

  if (!location?.lat || !location?.lng) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground">
        Ubicacion no disponible
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm">
      <div className="flex flex-col gap-3 border-b border-border/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <MapPin className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-semibold font-heading">{title}</h2>
            {address && (
              <p className="text-sm text-muted-foreground">{address}</p>
            )}
          </div>
        </div>
      </div>
      <div className="h-80 w-full">
        <MapGL
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <NavigationControl position="top-right" />
          <Marker
            longitude={location.lng}
            latitude={location.lat}
            anchor="bottom"
          >
            <MapPin
              className="h-9 w-9 fill-primary text-primary-foreground drop-shadow-lg"
              aria-label={title}
            />
          </Marker>
        </MapGL>
      </div>
    </section>
  );
}


// 'use client';
// import "leaflet/dist/leaflet.css";

// import { MapPin } from "lucide-react";
// import { useEffect, useState } from "react";
// import { normalizeColombiaMapPoint } from "@/lib/mapCoordinates";
// import type { GeoPoint } from "@/types";

// let L: any;
// let MapContainer: any;
// let TileLayer: any;
// let Marker: any;
// let Popup: any;

// interface MapProps {
//   location?: GeoPoint | null;
//   title?: string;
//   address?: string;
//   className?: string;
// }

// export function Map({ location, title = "Ubicacion", address, className = "h-80" }: MapProps) {
//   const [isReady, setIsReady] = useState(false);
//   const point = normalizeColombiaMapPoint(location);

//   console.log("Location recibida:", location);
  

//   console.log("Punto normalizado:", point);

//   useEffect(() => {
//     const loadLeaflet = async () => {
//       // Importar Leaflet
//       const leaflet = await import("leaflet");
//       const reactLeaflet = await import("react-leaflet");
      
//       L = leaflet.default;
//       MapContainer = reactLeaflet.MapContainer;
//       TileLayer = reactLeaflet.TileLayer;
//       Marker = reactLeaflet.Marker;
//       Popup = reactLeaflet.Popup;
      
//       // SOLUCIÓN: Configurar los iconos correctamente
//       // Opción 1: Usar CDN de Leaflet (recomendado)
//       L.Icon.Default.imagePath = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/";
      
//       // Opción 2: Configurar iconos manualmente
//       delete L.Icon.Default.prototype._getIconUrl;
//       L.Icon.Default.mergeOptions({
//         iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//         iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//         shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
//       });
      
//       setIsReady(true);
//     };
    
//     loadLeaflet();
//   }, []);

//   if (!point) {
//     return (
//       <div className={`flex items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground ${className}`}>
//         Ubicación no disponible
//       </div>
//     );
//   }

//   if (!isReady) {
//     return (
//       <div className={`flex items-center justify-center rounded-2xl border border-border/50 bg-muted text-muted-foreground ${className}`}>
//         Cargando mapa...
//       </div>
//     );
//   }

//   return (
//     <div className={`relative overflow-hidden rounded-2xl border border-border/50 bg-background shadow-warm ${className}`}>
//       <div className="flex flex-col gap-3 border-b border-border/50 p-4">
//         <div className="flex gap-3">
//           <MapPin className="mt-1 h-5 w-5 text-primary" />
//           <div>
//             <h2 className="font-semibold font-heading">{title}</h2>
//             {address && <p className="text-sm text-muted-foreground">{address}</p>}
//           </div>
//         </div>
//       </div>
      
//       <div style={{ height: `calc(100% - 73px)`, minHeight: "300px" }}>
//         <MapContainer
//           center={[point.lat, point.lng]}
//           zoom={15}
//           style={{ width: "100%", height: "100%" }}
//         >
//           <TileLayer
//             attribution='&copy; OpenStreetMap contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <Marker position={[point.lat, point.lng]}>
//             <Popup>
//               <div className="p-1">
//                 <h3 className="font-semibold text-sm">{title}</h3>
//                 {address && <p className="text-xs mt-1">{address}</p>}
//               </div>
//             </Popup>
//           </Marker>
//         </MapContainer>
//       </div>
//     </div>
//   );
// }
