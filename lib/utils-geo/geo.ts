// lib/geo.ts

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Calcula el Bounding Box geográfico dado un punto central y un radio en metros.
 */
export function getBoundingBox(center: Coordinates, radiusInMeters: number): BoundingBox {
  const EARTH_RADIUS_METERS = 6371000;
  
  // Convertir el radio a radianes
  const angularDistance = radiusInMeters / EARTH_RADIUS_METERS;
  
  // Convertir coordenadas del centro a radianes
  const latRad = (center.lat * Math.PI) / 180;
  
  // Delta de Latitud (constante en toda la Tierra)
  const deltaLat = angularDistance * (180 / Math.PI);
  
  // Delta de Longitud (varía según la latitud en la que te encuentres)
  const deltaLng = (angularDistance / Math.cos(latRad)) * (180 / Math.PI);

  return {
    minLat: center.lat - deltaLat,
    maxLat: center.lat + deltaLat,
    minLng: center.lng - deltaLng,
    maxLng: center.lng + deltaLng,
  };
}

/**
 * Fórmula de Haversine para calcular la distancia exacta entre dos puntos
 */
export function calculateHaversineDistance(p1: Coordinates, p2: Coordinates): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const phi1 = (p1.lat * Math.PI) / 180;
  const phi2 = (p2.lat * Math.PI) / 180;
  const deltaPhi = ((p2.lat - p1.lat) * Math.PI) / 180;
  const deltaLambda = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}