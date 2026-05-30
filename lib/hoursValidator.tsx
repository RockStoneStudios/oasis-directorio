export interface BusinessHourSlot {
  day?: string;
  open?: string;
  close?: string;
  isOpen?: boolean;
  isClosed?: boolean;
  useGlobalCustomText?: boolean;
}

const DAYS_MAP: Record<number, string> = {
  0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday"
};

const DAYS_INDEX: Record<string, number> = {
  lun: 1, mar: 2, mie: 3, mié: 3, jue: 4, vie: 5, sab: 6, sáb: 6, dom: 0
};

function parseTimeToMinutes(timeStr: string): number | null {
  const clean = timeStr.toLowerCase().replace(/\s+/g, "");
  const ampmMatch = clean.match(/^(\d+)(?::(\d+))?(am|pm)$/);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const ampm = ampmMatch[3];
    if (ampm === "pm" && hours < 12) hours += 12;
    if (ampm === "am" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }
  const militaryMatch = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (militaryMatch) {
    return parseInt(militaryMatch[1], 10) * 60 + parseInt(militaryMatch[2], 10);
  }
  return null;
}

function checkStringSchedule(scheduleStr: string, currentDayNum: number, currentMinutes: number): boolean {
  const clean = scheduleStr.toLowerCase().trim();
  if (clean.includes("24 horas") || clean.includes("24hrs") || clean.includes("24h") || clean.includes("disponible las 24") || clean.includes("siempre abierto")) {
    return true;
  }
  const daysRegex = /(lun|mar|mié|mie|jue|vie|sáb|sab|dom)(?:\s*-\s*(lun|mar|mié|mie|jue|vie|sáb|sab|dom))?/;
  const hoursRegex = /(\d+(?::\d+)?\s*(?:am|pm)?)\s*-\s*(\d+(?::\d+)?\s*(?:am|pm)?)/;
  const daysMatch = clean.match(daysRegex);
  const hoursMatch = clean.match(hoursRegex);
  if (!daysMatch || !hoursMatch) return false;
  const startDay = DAYS_INDEX[daysMatch[1]];
  const endDay = daysMatch[2] ? DAYS_INDEX[daysMatch[2]] : startDay;
  let dayMatches = false;
  if (daysMatch[2]) {
    const adjustEnd = endDay === 0 ? 7 : endDay;
    const adjustCurrent = currentDayNum === 0 ? 7 : currentDayNum;
    if (startDay <= adjustEnd) {
      dayMatches = adjustCurrent >= startDay && adjustCurrent <= adjustEnd;
    } else {
      dayMatches = adjustCurrent >= startDay || adjustCurrent <= adjustEnd;
    }
  } else {
    dayMatches = currentDayNum === startDay;
  }
  if (!dayMatches) return false;
  const openMinutes = parseTimeToMinutes(hoursMatch[1]);
  const closeMinutes = parseTimeToMinutes(hoursMatch[2]);
  if (openMinutes === null || closeMinutes === null) return false;
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

/**
 * VALIDADOR ULTRA-MUTADO PARA ADMITIR BOMBEROS Y POLICÍA
 */
export function isBusinessOpen(hoursData: any, businessStatus?: string): boolean {
  // REGLA 1: Forzar apertura si el status general es alwaysopen
  if (businessStatus === "alwaysopen") return true;

  if (!hoursData) return false;

  // Obtener tiempo actual en Colombia de forma dinámica
  const nowInColombia = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }));
  const currentDayNum = nowInColombia.getDay(); 
  const currentDayName = DAYS_MAP[currentDayNum];
  const currentMinutes = nowInColombia.getHours() * 60 + nowInColombia.getMinutes();

  // Caso A: Si hoursData viene como un objeto directo (No Array)
  if (typeof hoursData === "object" && !Array.isArray(hoursData)) {
    if (hoursData.isOpen === true && hoursData.isClosed !== true) return true;
    if (hoursData.isClosed === true || hoursData.isOpen === false) return false;
  }

  // Caso B: Si viene un String plano directo
  if (typeof hoursData === "string") {
    return checkStringSchedule(hoursData, currentDayNum, currentMinutes);
  }

  // Caso C: Si viene un Array (Caso de Bomberos y Policía)
  if (Array.isArray(hoursData)) {
    if (hoursData.length === 0) return false;

    // REGLA MAESTRA 24/7 INTERCEPTORA: 
    // Si el primer item del arreglo dice isOpen: true y NO está asociado a un día específico (como un lunes),
    // es un interruptor global de 24 horas (como el de tu imagen y el JSON de la Policía)
    const firstItem = hoursData[0];
    if (firstItem && typeof firstItem === "object" && firstItem.isOpen === true && !firstItem.day) {
      if (firstItem.isClosed !== true) {
        return true;
      }
    }

    // Doble verificación por si viene en sub-propiedades del array
    const isAlwaysOpen = hoursData.some(h => 
      (h && h.isOpen === true && !h.day) || 
      (h && h.isOpen === true && h.day === "all") || 
      (h && h.open === "00:00" && h.close === "23:59")
    );
    if (isAlwaysOpen) return true;

    // Si es un array de strings planos
    if (typeof hoursData[0] === "string") {
      return hoursData.some((strSchedule: string) => checkStringSchedule(strSchedule, currentDayNum, currentMinutes));
    }

    // Evaluación tradicional por turnos de días de la semana
    const todaySchedule = hoursData.find((h) => h && h.day === currentDayName && h.isOpen);
    if (!todaySchedule) return false;

    const openMinutes = parseTimeToMinutes(todaySchedule.open || "");
    const closeMinutes = parseTimeToMinutes(todaySchedule.close || "");

    if (openMinutes === null || closeMinutes === null) return false;

    if (closeMinutes < openMinutes) {
      return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
    }

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }

  return false;
}