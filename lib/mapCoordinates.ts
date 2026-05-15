import type { GeoPoint } from "@/types";

export interface LatLng {
  lat: number;
  lng: number;
}

const COLOMBIA_LAT_RANGE = { min: -5, max: 15 };
const COLOMBIA_LNG_RANGE = { min: -82, max: -66 };

/**
 * Intenta corregir coordenadas que vienen como enteros gigantes 
 * (ej: -75742088 -> -75.742088)
 */
function fixIntegerCoordinate(value: number): number {
  const absValue = Math.abs(value);
  // Si el valor es mayor a 180 (el límite de longitud), asumimos que le falta el punto decimal
  if (absValue > 180) {
    // Convertimos a string para contar dígitos y posicionar el punto después de los primeros 2
    const str = value.toString();
    const isNegative = value < 0;
    const cleanStr = str.replace('-', '');
    
    // Insertamos el punto decimal después de los dos primeros dígitos
    const fixedStr = `${isNegative ? '-' : ''}${cleanStr.slice(0, 2)}.${cleanStr.slice(2)}`;
    return Number(fixedStr);
  }
  return value;
}

export function normalizeMapPoint(
  location?: GeoPoint | LatLng | null,
): LatLng | null {
  if (
    !location ||
    !isCoordinateValue(location.lat) ||
    !isCoordinateValue(location.lng)
  ) {
    return null;
  }

  // Reparamos los valores si vienen como enteros grandes antes de convertirlos
  const rawLat = Number(location.lat);
  const rawLng = Number(location.lng);

  const point = { 
    lat: fixIntegerCoordinate(rawLat), 
    lng: fixIntegerCoordinate(rawLng) 
  };

  if (isValidLatLng(point)) {
    return point;
  }

  return null;
}

export function normalizeColombiaMapPoint(
  location?: GeoPoint | LatLng | null,
): LatLng | null {
  if (
    !location ||
    !isCoordinateValue(location.lat) ||
    !isCoordinateValue(location.lng)
  ) {
    return null;
  }

  // Primero intentamos la normalización estándar con el arreglo de enteros
  const point = normalizeMapPoint(location);
  if (!point) return null;

  // Manejo de caso donde Lat y Lng vienen invertidos
  const swapped = { lat: point.lng, lng: point.lat };

  if (isInColombia(swapped) && !isInColombia(point)) {
    return swapped;
  }

  // Si el punto normalizado (y reparado) está en el rango de Colombia, lo devolvemos
  if (isInColombia(point)) {
    return point;
  }

  // Si no está en Colombia, devolvemos el punto válido pero no garantizamos ubicación local
  return isValidLatLng(point) ? point : null;
}

function isCoordinateValue(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  return (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Number(value))
  );
}

function isValidLatLng(point: LatLng) {
  return (
    point.lat >= -90 &&
    point.lat <= 90 &&
    point.lng >= -180 &&
    point.lng <= 180
  );
}

function isInColombia(point: LatLng) {
  return (
    point.lat >= COLOMBIA_LAT_RANGE.min &&
    point.lat <= COLOMBIA_LAT_RANGE.max &&
    point.lng >= COLOMBIA_LNG_RANGE.min &&
    point.lng <= COLOMBIA_LNG_RANGE.max
  );
}