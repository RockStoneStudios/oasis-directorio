import type { BusinessCardData, BusinessDetail } from "@/types/business";
import type { BusinessHours, Slug } from "@/types";

const DAY_LABELS: Record<string, string> = {
  Sunday: "Domingo",
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miercoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sabado",
};

const DAY_KEYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getSlugValue(slug?: Slug | string | null) {
  if (!slug) return "";
  return typeof slug === "string" ? slug : slug.current;
}

export function getBusinessHref(business: Pick<BusinessCardData, "slug" | "_id">) {
  const slug = getSlugValue(business.slug);
  return `/business/${slug || business._id}`;
}

export function formatAddress(address?: BusinessCardData["address"] | null) {
  if (!address) return "";
  return [address.street, address.neighborhood, address.state]
    .filter(Boolean)
    .join(", ");
}

function toMinutes(time?: string | null) {
  if (!time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

export function isBusinessOpenNow(
  hours?: BusinessHours[] | null,
  now = new Date(),
) {
  if (!hours || hours.length === 0) return false;
  const today = DAY_KEYS[now.getDay()];
  const todayHours = hours.find((item) => item.day === today);
  if (!todayHours || todayHours.isClosed) return false;

  const open = toMinutes(todayHours.open);
  const close = toMinutes(todayHours.close);
  if (open === null || close === null) return false;

  const current = now.getHours() * 60 + now.getMinutes();
  return close < open
    ? current >= open || current <= close
    : current >= open && current <= close;
}

export function getTodayHoursLabel(hours?: BusinessHours[] | null) {
  if (!hours || hours.length === 0) return "Horario no disponible";
  const today = DAY_KEYS[new Date().getDay()];
  const todayHours = hours.find((item) => item.day === today);
  if (!todayHours || todayHours.isClosed) return "Cerrado hoy";
  return `${formatTime(todayHours.open)} - ${formatTime(todayHours.close)}`;
}

export function formatTime(value?: string | null) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  return new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2026, 0, 1, hours, minutes));
}

export function formatDay(day: string) {
  return DAY_LABELS[day] || day;
}

export function generateWhatsAppUrl(phone?: string | null, message?: string) {
  // 1. Validar que el teléfono exista
  if (!phone) return "";
  
  // 2. Limpiar el número (solo dígitos)
  const cleanPhone = phone.replace(/\D/g, "");
  
  // 3. Validar que tenga al menos 10 dígitos
  if (cleanPhone.length < 10) {
    console.warn(`⚠️ Número inválido (muy corto): ${phone}`);
    return "";
  }
  
  // 4. Formatear número para Colombia
  let formattedPhone = cleanPhone;
  
  // Caso 1: Número colombiano de 10 dígitos (3106201920)
  if (cleanPhone.length === 10 && cleanPhone.startsWith("3")) {
    formattedPhone = `57${cleanPhone}`; // → 573106201920
  }
  // Caso 2: Número colombiano con 0 inicial (03106201920)
  else if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) {
    formattedPhone = `57${cleanPhone.substring(1)}`; // → 573106201920
  }
  // Caso 3: Número colombiano con 57 incluido (573106201920)
  else if (cleanPhone.length === 12 && cleanPhone.startsWith("57")) {
    formattedPhone = cleanPhone; // → 573106201920
  }
  // Caso 4: Número colombiano de 10 dígitos que NO empieza con 3 (fijo)
  else if (cleanPhone.length === 10 && !cleanPhone.startsWith("3")) {
    formattedPhone = `57${cleanPhone}`; // → 574xxx...
  }
  // Caso 5: Número con prefijo + (ej: +573106201920 → 573106201920)
  else if (cleanPhone.length === 13 && cleanPhone.startsWith("57")) {
    formattedPhone = cleanPhone; // → 573106201920
  }
  // Caso 6: Cualquier otro número (intentar forzar código Colombia)
  else if (cleanPhone.length > 10 && !cleanPhone.startsWith("57")) {
    // Quitar prefijos extraños y añadir 57
    const last10Digits = cleanPhone.slice(-10);
    if (last10Digits.startsWith("3")) {
      formattedPhone = `57${last10Digits}`;
    } else {
      formattedPhone = `57${last10Digits}`;
    }
  }
  
  // 5. Validación final: asegurar que tenga 12 dígitos (57 + 10)
  if (formattedPhone.length !== 12) {
    console.warn(`⚠️ Número formateado incorrecto: ${formattedPhone} (original: ${phone})`);
    return "";
  }
  
  // 6. Codificar el mensaje
  const defaultMessage = "Hola, vi tu negocio en Oasis y me gustaría recibir información.";
  const text = encodeURIComponent(message || defaultMessage);
  
  // 7. Retornar URL final
  return `https://wa.me/${formattedPhone}?text=${text}`;
}
export function normalizeBusinessData<T extends BusinessCardData | BusinessDetail>(
  business: T,
) {
  return {
    ...business,
    href: getBusinessHref(business),
    addressLabel: formatAddress(business.address),
    isOpenNow:
      "hours" in business ? isBusinessOpenNow(business.hours) : business.status === "open",
    whatsappUrl: generateWhatsAppUrl(business.whatsapp, `Hola, vi ${business.name} en Oasis y quiero mas informacion.`),
  };
}
