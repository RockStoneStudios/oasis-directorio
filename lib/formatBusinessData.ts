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
  if (!phone) return "";
  const cleanPhone = phone.replace(/\D/g, "");
  const text = encodeURIComponent(
    message || "Hola, vi tu negocio en Oasis y me gustaria recibir informacion.",
  );
  return `https://wa.me/${cleanPhone}?text=${text}`;
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
