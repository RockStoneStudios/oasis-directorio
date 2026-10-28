import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Store, HelpCircle, MapPin } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { BUSINESS_BY_SUBCATEGORY_QUERY } from "@/lib/sanity/queries";
import { BusinessCard } from "@/components/BusinessCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";
const REGION = "Occidente Antioqueño";
const MUNI_TEXT = "Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya";

const MUNICIPIOS = ["Sopetrán", "San Jerónimo", "Santa Fe de Antioquia", "Liborina", "Olaya"];
const MUNICIPIOS_SLUG: Record<string, string> = {
  "Sopetrán": "sopetran",
  "San Jerónimo": "san-jeronimo",
  "Santa Fe de Antioquia": "santa-fe-de-antioquia",
  "Liborina": "liborina",
  "Olaya": "olaya"
};

const getBusinessesBySlug = cache(async (slug: string) => {
  const result = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });
  return (result ?? []) as any[];
});

function formatSlugText(slug: string): string {
  if (!slug) return "";
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}
function stripHtmlAndTruncate(text: string, maxLength: number): string {
  if (!text) return "";
  const cleaned = text.replace(/(<([^>]+)>)/gi, "").replace(/\s+/g, " ").trim();
  return cleaned.length > maxLength ? cleaned.substring(0, maxLength - 3).trimEnd() + "..." : cleaned;
}
function normalize(text: string): string {
  return (text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
function getSlugText(slug: any): string {
  if (!slug) return "";
  return typeof slug === "object" ? slug.current || "" : slug;
}
function resolveCategoryName(slug: string, businesses: any[]): string {
  const fallback = formatSlugText(slug);
  if (businesses.length === 0) return fallback;
  const first = businesses[0];
  return first.category?.slug?.current === slug
    ? first.category.name
    : first.subcategory?.name || first.category?.name || fallback;
}

type Niche =
  | "lodging" | "food" | "beauty" | "nightlife" | "shopping" | "transport" | "moving"
  | "health" | "emergency" | "religion" | "tourism" | "agro" | "internet" | "services" | "desserts" | "fresh" | "campo" | "party" | "adult" | "home" | "financial" | "fashion" | "gifts" | "general";

function detectNiche(categoryName: string, slug?: string): Niche {
  const c = normalize(categoryName);
  const s = normalize(slug || "");
  const has = (...words: string[]) => words.some((w) => c.includes(w) || s.includes(w));
  if (has("detalles y regalos", "detalles-y-regalos", "detalles", "regalos", "floristeria", "boutique", "floreria")) return "gifts";
  if (has("servicios financieros", "servicios-financieros", "financiero", "banco", "cajero", "retiro de plata", "【entity-bancolombia¦canonical_name=Bancolombia】")) return "financial";
  if (has("moda & accesorios", "moda-accesorios", "moda", "accesorios", "joyeria", "almacen", "ropa")) return "fashion";
  if (has("arte corporal", "arte-corporal", "sex shop", "sexshop", "tatuaje", "tatuajes")) return "adult";
  if (has("noche & diversion", "noche-diversion", "noche", "diversion", "discoteca", "farra", "hora loca")) return "party";
  if (has("para el hogar", "para-el-hogar", "hogar", "abarrotes")) return "home";
  if (has("tecnologia y conexion", "tecnologia-y-conexion", "tecnologia", "conexion", "celulares", "computadores", "wifi", "internet")) return "internet";
  if (has("quieres refrescarte", "quieres-refrescarte", "refrescarte", "refrescar", "heladeria", "helado", "postre", "dulce", "salpicon", "waffle", "wafle", "sandwich", "crepes", "malteada", "frappe", "dulceria")) return "desserts";
  if (has("alimentos frescos", "alimentos-frescos", "legumbreria", "charcuteria", "legumbres", "frutas y verduras", "carniceria")) return "fresh";
  if (has("todo para el campo", "todo-para-el-campo", "para el campo", "cuido", "concentrado")) return "campo";
  if (has("alojamiento", "bienes raices", "finca", "glamping", "inmobiliaria", "arriendo", "hospedaje", "hotel", "cabana", "cabaña")) return "lodging";
  if (has("barberia", "peluqueria", "estetica", "uñas", "unas", "spa", "belleza")) return "beauty";
  if (has("restaurante & bar", "licorera", "rumba", "licores") || /\bbares?\b/.test(c)) return "nightlife";
  if (has("donde comer", "donde-comer", "restaurante", "comidas rapidas", "comida")) return "food";
  if (has("supermercado", "tienda", "compras", "mercado", "minimercado")) return "shopping";
  if (has("trasteo", "mudanza", "carga", "acarreo")) return "moving";
  if (has("mototaxi", "domicilios", "encomienda", "transporte")) return "transport";
  if (has("farmacia", "drogueria", "odontologia", "fisioterapia", "salud", "bienestar", "gym", "crossfit", "dental", "optica")) return "health";
  if (has("basicos", "policia", "bomberos", "emergencia", "servicios de emergencia")) return "emergency";
  if (has("fe y espiritualidad", "fe-y-espiritualidad", "fe", "espiritualidad", "religion", "parroquia", "iglesia", "misa")) return "religion";
  if (has("turismo", "viajes", "aventura", "caminata", "cuatrimoto")) return "tourism";
  if (has("agroinsumo", "agricola", "fertilizante", "veterinaria")) return "agro";
  if (has("servicios tecnicos", "servicios-tecnicos", "servicios", "reparacion", "tecnico", "mantenimiento", "electricista", "plomero", "taller mecanico", "aire acondicionado")) return "services";
  return "general";
}

function buildCategoryDescription(categoryName: string, count: number, region: string, slug?: string): string {
  const n = count > 0 ? `${count} ` : "";
  const byNiche: Record<Niche, string> = {
    gifts: `${n}floristerias y boutiques en ${region} con rosas y arreglos florales. Detalles y regalos en ${MUNI_TEXT} por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    food: `${n}restaurantes, comidas rapidas y postres en ${region} con domicilio a fincas. Donde comer en ${MUNI_TEXT} por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    home: `${n}tiendas, supermercados y abarrotes en ${region} con mercado y productos para el hogar. Supermercado en ${MUNI_TEXT} con domicilio por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    health: `${n}farmacia, drogueria, odontologia, fisioterapia, gym y crossfit en ${region} con domicilio. Medicamentos y citas por 【entity-WhatsApp¦canonical_name=WhatsApp】 en ${MUNI_TEXT}.`,
    financial: `${n}bancos, cajeros y retiro de plata en ${region}. Banco y cajero en ${MUNI_TEXT} con ubicacion y horarios por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    fashion: `${n}moda y estilo, ropa, tenis y joyeria oro 18k en ${region}. Almacen y joyeria en ${MUNI_TEXT} por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    nightlife: `${n}licoreras y bares en ${region} con domicilio y horarios. Cerveza, aguardiente y ron con 【entity-WhatsApp¦canonical_name=WhatsApp】 directo.`,
    party: `${n}discotecas y bares en ${region} con farra y hora loca. Rumba en ${MUNI_TEXT} por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    adult: `${n}tatuajes y sex shop en ${region} con lubricantes, lenceria y accesorios. Tatuajes y arte corporal en Sopetran y San Jeronimo por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    shopping: `${n}supermercados y tiendas en ${region} con domicilio a casas y fincas. Pide por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    beauty: `${n}barberia y peluqueria en ${region}. Cortes, uñas y estetica con citas por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    transport: `${n}mototaxis y domicilios en ${region} 24h. Servicio rapido por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    moving: `${n}trasteos y mudanzas en ${region}. Cotiza tu trasteo y transporte de carga por 【entity-WhatsApp¦canonical_name=WhatsApp】.`,
    emergency: `${n}estaciones de bomberos y policia en ${region} para incendios, robos y peleas. Emergencia 24h en ${MUNI_TEXT} con contacto directo.`,
    religion: `${n}parroquias e iglesias en ${region} con horarios de misa y servicios parroquiales. Parroquia en ${MUNI_TEXT}.`,
    tourism: `${n}turismo y aventura en ${region}: cuatrimotos, caminatas y planes turisticos. Reserva directo.`,
    lodging: `${n}hoteles, hospedaje y glamping en ${region} con piscina, fincas y cabañas. Hoteles y glamping en ${MUNI_TEXT} con reserva por WhatsApp.`,
    agro: `${n}agroinsumos y veterinaria en ${region}. Fertilizantes y concentrados con domicilio.`,
    internet: `${n}reparacion y venta de celulares y computadores, venta de tecnologia y WiFi hasta 120 mb en ${region}. Instalacion WiFi urbana y rural para fincas por WhatsApp.`,
    services: `${n}taller mecanico de motos y carros, reparacion de neveras, estufas y aires acondicionados, redes de gas y electricas en ${MUNI_TEXT}. Cotiza por WhatsApp.`,
    desserts: `${n}heladerias en ${region} con helados, salpicones, wafles y sandwiches. Helado artesanal, salpicon de frutas, wafles con helado y sandwiches con domicilio a fincas por WhatsApp.`,
    fresh: `${n}legumbrerias y charcuterias en ${MUNI_TEXT}: frutas, verduras, carnes y alimentos frescos con domicilio a fincas. Pide por WhatsApp.`,
    campo: `${n}cuido y comida para perros, gatos, caballos y peces, agroinsumos y concentrados en ${MUNI_TEXT}. Veterinaria y todo para fincas por WhatsApp.`,
    general: `${n}${categoryName} en ${region} cerca del parque. Telefono y WhatsApp directo en Ooasys.`,
  };
  return stripHtmlAndTruncate(byNiche[detectNiche(categoryName, slug)], 155);
}

function getCategoryFaqs(categoryName: string, region: string, slug?: string) {
  const niche = detectNiche(categoryName, slug);
  if (niche === "gifts") {
    return [
      { q: `¿Dónde encontrar floristería en ${region}?`, a: `En Ooasys listamos floristerías y boutiques en ${region} con rosas y arreglos florales en ${MUNI_TEXT}.` },
      { q: `¿Dónde comprar detalles y regalos en Sopetrán?`, a: `En Ooasys encuentras detalles, regalos, floristería y boutique en Sopetrán con rosas, arreglos florales y detalles personalizados.` },
      { q: `¿Cómo pedir un arreglo floral en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Pide rosas y arreglos florales directo." },
    ];
  }
  if (niche === "religion") {
    return [
      { q: `¿Dónde hay misa en ${region}?`, a: `En Ooasys listamos parroquias e iglesias en ${region} con horarios de misa y servicios parroquiales en ${MUNI_TEXT}.` },
      { q: `¿Qué servicios parroquiales hay en Sopetrán?`, a: `En Ooasys encuentras servicios parroquiales en Sopetrán: bautizos, matrimonios, confesiones y horarios de misa.` },
      { q: `¿Dónde está la parroquia de ${region}?`, a: `Revisa la ficha de cada parroquia en Ooasys para ver su ubicación, horarios de misa y servicios.` },
    ];
  }
  if (niche === "emergency") {
    return [
      { q: `¿Qué hacer si hay un incendio en ${region}?`, a: `En Ooasys listamos bomberos y policía en ${region} para incendios, robos y peleas con emergencia 24h en ${MUNI_TEXT}.` },
      { q: `¿Dónde denunciar un robo en ${region}?`, a: `En Ooasys encuentras policía en ${region} para denunciar robos y peleas con contacto directo por 【entity-WhatsApp¦canonical_name=WhatsApp】.` },
      { q: `¿Hay bomberos 24h en ${region}?`, a: "Sí, bomberos y policía en Sopetrán, San Jerónimo, Santa Fe de Antioquia, Liborina y Olaya trabajan 24h. Revisa su ficha." },
    ];
  }
  if (niche === "financial") {
    return [
      { q: `¿Dónde hay bancos y cajeros en ${region}?`, a: `En Ooasys listamos bancos y cajeros en ${region} con retiro de plata en ${MUNI_TEXT}.` },
      { q: `¿Dónde retirar plata en Sopetrán?`, a: `En Ooasys encuentras cajeros y bancos en Sopetrán para retiro de plata con ubicación y horarios.` },
      { q: `¿Cómo contactar un banco en ${region}?`, a: "Usa el botón de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha. Contacto directo." },
    ];
  }
  if (niche === "fashion") {
    return [
      { q: `¿Dónde comprar ropa en ${region}?`, a: `En Ooasys listamos moda y estilo, ropa y tenis en ${region} con tiendas en ${MUNI_TEXT}.` },
      { q: `¿Dónde comprar joyería oro 18k en ${region}?`, a: `En Ooasys encuentras joyería oro 18k y plata en ${region} con almacenes en Sopetrán y San Jerónimo.` },
      { q: `¿Cómo contactar un almacén de moda en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Contacto directo." },
    ];
  }
  if (niche === "health") {
    return [
      { q: `¿Dónde encontrar droguería en ${region}?`, a: `En Ooasys listamos farmacia y droguería en ${region} con domicilio y WhatsApp directo en ${MUNI_TEXT}.` },
      { q: `¿Dónde hay gym y crossfit en ${region}?`, a: `En Ooasys encuentras gym, crossfit, odontología y fisioterapia en ${region} con citas por 【entity-WhatsApp¦canonical_name=WhatsApp】 directo.` },
      { q: `¿Cómo pedir medicamentos y citas en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Pide medicamentos, agenda odontología, fisioterapia y gym directo." },
    ];
  }
  if (niche === "food") {
    return [
      { q: `¿Dónde comer en ${region}?`, a: `En Ooasys listamos restaurantes, comidas rápidas y postres en ${region} con domicilio y 【entity-WhatsApp¦canonical_name=WhatsApp】 directo en ${MUNI_TEXT}.` },
      { q: `¿Qué comidas rápidas en Sopetrán tienen domicilio?`, a: `La mayoría de restaurantes y comidas rápidas en Sopetrán hacen domicilio a fincas y veredas. Pide por WhatsApp.` },
      { q: `¿Dónde encontrar postres en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Pide postres, helados y comidas rápidas directo sin intermediarios." },
    ];
  }
  if (niche === "home") {
    return [
      { q: `¿Dónde encontrar supermercado en ${region}?`, a: `En Ooasys listamos tiendas, supermercados y abarrotes en ${region} con mercado y productos para el hogar con domicilio y WhatsApp directo.` },
      { q: `¿Qué tiendas en Sopetrán venden abarrotes?`, a: `En Ooasys encuentras tiendas y supermercados en Sopetrán con abarrotes, mercado y productos para el hogar con domicilio a fincas.` },
      { q: `¿Cómo pedir mercado a domicilio en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Pide abarrotes y mercado directo sin intermediarios." },
    ];
  }
  if (niche === "nightlife") {
    return [
      { q: `¿Dónde encontrar licorera en ${region}?`, a: `En Ooasys listamos licoreras y bares en ${region} con domicilio y 【entity-WhatsApp¦canonical_name=WhatsApp】 directo. Cerveza, aguardiente y ron en ${MUNI_TEXT}.` },
      { q: `¿Qué licoreras en Sopetrán tienen cerveza, aguardiente y ron?`, a: `La mayoría de licoreras en Sopetrán tienen cerveza, aguardiente y ron con domicilio a fincas y veredas.` },
      { q: `¿Cómo pedir licor a domicilio en Sopetrán?`, a: "Usa el botón de WhatsApp en la ficha. Pide cerveza, aguardiente y ron directo sin intermediarios." },
    ];
  }
  if (niche === "party") {
    return [
      { q: `¿Dónde hay discotecas y bares en ${region}?`, a: `En Ooasys listamos discotecas y bares en ${region} con farra y hora loca en ${MUNI_TEXT}.` },
      { q: `¿Qué bares en Sopetrán tienen farra y hora loca?`, a: `En Ooasys encuentras discotecas y bares en Sopetrán con farra, hora loca y música en vivo. Revisa cada ficha.` },
      { q: `¿Cómo contactar una discoteca en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Contacto directo, sin intermediarios." },
    ];
  }
  if (niche === "adult") {
    return [
      { q: `¿Dónde hacer tatuajes en ${region}?`, a: `En Ooasys listamos arte corporal y tatuajes en ${region} con citas por WhatsApp directo en Sopetrán y San Jerónimo.` },
      { q: `¿Dónde comprar lencería y lubricantes en ${region}?`, a: `En Ooasys encuentras sex shop en ${region} con lubricantes, lencería y accesorios. Contacta por 【entity-WhatsApp¦canonical_name=WhatsApp】.` },
      { q: `¿Cómo contactar un sex shop en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Contacto directo y discreto." },
    ];
  }
  if (niche === "internet") {
    return [
      { q: `¿Dónde reparar celulares en ${region}?`, a: `En Ooasys listamos reparación y venta de celulares y computadores en ${region} con servicio en ${MUNI_TEXT}.` },
      { q: `¿Dónde instalar WiFi en ${region} para fincas?`, a: `En Ooasys encuentras instalación WiFi en zona urbana y rural para fincas en ${region} con planes hasta 120 mb de velocidad.` },
      { q: `¿Cómo cotizar WiFi y tecnología en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Cotiza reparación de celulares, computadores y planes WiFi directo." },
    ];
  }
  if (niche === "fresh") {
    return [
      { q: `¿Dónde encontrar legumbrería en Sopetrán y San Jerónimo?`, a: `En Ooasys listamos legumbrerías y charcuterías en ${MUNI_TEXT} con frutas, verduras y carnes frescas con domicilio y WhatsApp directo.` },
      { q: `¿Qué charcuterías en Sopetrán tienen domicilio?`, a: `La mayoría de legumbrerías y charcuterías en Sopetrán hacen domicilio a fincas y veredas. Pide por WhatsApp.` },
      { q: `¿Cómo pedir alimentos frescos a domicilio en Sopetrán?`, a: "Usa el botón de WhatsApp en la ficha. Pide frutas, verduras y carnes directo sin intermediarios." },
    ];
  }
  if (niche === "campo") {
    return [
      { q: `¿Dónde comprar cuido para perros y gatos en Sopetrán?`, a: `En Ooasys listamos todo para el campo en ${MUNI_TEXT}: cuidos y comida para perros, gatos, caballos y peces, con domicilio y 【entity-WhatsApp¦canonical_name=WhatsApp】 directo.` },
      { q: `¿Dónde encontrar agroinsumos en San Jerónimo?`, a: `En Ooasys encuentras agroinsumos, concentrados y veterinaria en San Jerónimo y Sopetrán para fincas y campo. Cotiza por WhatsApp.` },
      { q: `¿Cómo pedir cuido a domicilio en Sopetrán?`, a: "Usa el botón de WhatsApp en la ficha. Pide cuido para perros, gatos, caballos y peces directo." },
    ];
  }
  if (niche === "services") {
    return [
      { q: `¿Dónde encontrar taller mecánico en Sopetrán?`, a: `En Ooasys listamos talleres mecánicos de motos y carros en ${MUNI_TEXT} con reparación y mantenimiento por WhatsApp directo.` },
      { q: `¿Quién repara aires, neveras y estufas en Sopetrán?`, a: `En Ooasys encuentras técnicos en Sopetrán para instalación y reparación de aires acondicionados, neveras y estufas.` },
      { q: `¿Quién instala redes de gas y eléctricas en Sopetrán?`, a: "Usa el botón de WhatsApp en la ficha. Cotiza instalación de redes de gas y eléctricas directo sin intermediarios." },
    ];
  }
  if (niche === "lodging") {
    return [
      { q: `¿Dónde encontrar hoteles en ${region}?`, a: `En Ooasys listamos hoteles, hospedaje y glamping en ${region} con piscina, fotos y WhatsApp directo, cerca del parque de ${MUNI_TEXT}.` },
      { q: `¿Hay hospedaje y glamping con piscina en ${region}?`, a: "Sí, la mayoría de hoteles, fincas, cabañas y glamping en el Occidente tienen piscina, BBQ y parqueadero. Revisa cada ficha en Ooasys." },
      { q: `¿Cómo reservar un hotel o glamping en ${region}?`, a: "Usa el botón de 【entity-WhatsApp¦canonical_name=WhatsApp】 en la ficha. Reserva directa sin intermediarios ni comisiones." },
    ];
  }
  if (niche === "desserts") {
    return [
      { q: `¿Dónde encontrar helados en ${region}?`, a: `En Ooasys listamos heladerías en ${region} con helados, salpicones, wafles y sandwiches con domicilio y WhatsApp directo.` },
      { q: `¿Qué heladerías en ${region} tienen salpicón, wafles y sandwiches?`, a: `La mayoría de heladerías en ${region} tienen salpicón de frutas, wafles con helado, malteadas y sandwiches. Revisa cada ficha en Ooasys.` },
      { q: `¿Cómo pedir helado a domicilio en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Pide helados, salpicones, wafles y sandwiches directo sin intermediarios." },
    ];
  }
  if (niche === "beauty") {
    return [
      { q: `¿Dónde encontrar barbería en ${region}?`, a: `En Ooasys listamos barbería y peluquería en ${region} con citas por WhatsApp.` },
      { q: `¿Dónde hacer uñas en ${region}?`, a: `En Ooasys encuentras peluquerías y estética en ${region} con servicio de uñas y corte.` },
      { q: `¿Cómo agendar en una peluquería en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Agenda directa." },
    ];
  }
  if (niche === "shopping") {
    return [
      { q: `¿Dónde encontrar supermercado en ${region}?`, a: `En Ooasys listamos supermercados y tiendas en ${region} con domicilio y WhatsApp directo.` },
      { q: `¿Qué tiendas en ${region} tienen domicilio?`, a: `La mayoría de supermercados en ${region} hacen domicilio a fincas y veredas.` },
      { q: `¿Cómo pedir domicilio en ${region}?`, a: "Usa el botón de WhatsApp en la ficha." },
    ];
  }
  if (niche === "tourism") {
    return [
      { q: `¿Qué hacer en ${region}?`, a: `En Ooasys encuentras turismo y aventura en ${region}: cuatrimotos, caminatas y planes turisticos.` },
      { q: `¿Dónde alquilar cuatrimotos en ${region}?`, a: `En Ooasys listamos cuatrimotos y aventura en ${region} con reserva por 【entity-WhatsApp¦canonical_name=WhatsApp】.` },
      { q: `¿Cómo reservar un plan turistico en ${region}?`, a: "Usa el botón de WhatsApp en la ficha. Reserva directa." },
    ];
  }
  if (niche === "transport") {
    return [
      { q: `¿Donde encontrar mototaxi en ${region}?`, a: `En Ooasys listamos mototaxis, domicilios y encomiendas en ${region} con telefono y WhatsApp directo.` },
      { q: `¿Cuánto vale un mototaxi en ${region}?`, a: `El precio depende de la distancia y si es dentro del pueblo o a una finca. Escribele directo por WhatsApp al mototaxi en Ooasys y cotiza sin intermediarios.` },
      { q: `¿Hay mototaxis 24 horas en ${region}?`, a: `Si, varios mototaxis y domicilios en ${region} trabajan 24h, sobre todo en Sopetran y San Jeronimo. Revisa en su ficha su horario y 【entity-WhatsApp¦canonical_name=WhatsApp】.` },
    ];
  }
  return [
    { q: `¿Donde encontrar ${categoryName} en ${region}?`, a: `En Ooasys listamos ${categoryName} en ${region} con telefono y WhatsApp directo.` },
    { q: `¿Como contactar ${categoryName} en ${region}?`, a: "Usa el boton de WhatsApp en la ficha. El contacto es directo con el negocio, sin intermediarios." },
    { q: `¿Hacen domicilio de ${categoryName} a fincas en ${region}?`, a: "Depende de cada negocio. Entra a su perfil y consultalo por WhatsApp, muchos atienden veredas y fincas." },
  ];
}

function getSeoTitle(categoryName: string, region: string, slug?: string): string {
  const niche = detectNiche(categoryName, slug);
  if (niche === "gifts") return `Floristería y Boutique en Sopetrán Rosas | Ooasys`;
  if (niche === "religion") return `Parroquias en Sopetrán Horarios de Misa | Ooasys`;
  if (niche === "food") return `Restaurantes y Comidas Rápidas en Sopetrán | Ooasys`;
  if (niche === "home") return `Supermercados y Abarrotes en Sopetrán | Ooasys`;
  if (niche === "health") return `Farmacia, Odontología y Fisioterapia en Sopetrán | Ooasys`;
  if (niche === "financial") return `Bancos y Cajeros en Sopetrán Retiro de Plata | Ooasys`;
  if (niche === "fashion") return `Ropa, Tenis y Joyería Oro 18k en Sopetrán | Ooasys`;
  if (niche === "emergency") return `Bomberos y Policía en Sopetrán Incendios | Ooasys`;
  if (niche === "fresh") return `Legumbrerías y Charcuterías en Sopetrán y San Jerónimo | Ooasys`;
  if (niche === "campo") return `Cuido para Perros, Gatos y Caballos en Sopetrán | Ooasys`;
  if (niche === "services") return `Taller Mecánico, Neveras y Aires en Sopetrán | Ooasys`;
  if (niche === "nightlife") return `Licoreras en Sopetrán Cerveza, Aguardiente y Ron | Ooasys`;
  if (niche === "party") return `Discotecas y Bares en Sopetrán Farra y Hora Loca | Ooasys`;
  if (niche === "adult") return `Tatuajes y Sex Shop en Sopetrán Lencería | Ooasys`;
  if (niche === "internet") return `Reparación de Celulares y WiFi 120 mb en Sopetrán | Ooasys`;
  if (niche === "desserts") return `Helados, Salpicones, Wafles y Sandwiches en ${region} | Ooasys`;
  if (niche === "transport") return `Mototaxis, Domicilios y Encomiendas en ${region} | Ooasys`;
  if (niche === "lodging") return `Hoteles, Hospedaje y Glamping en ${region} con Piscina | Ooasys`;
  if (niche === "beauty") return `Barbería y Peluquería en ${region} con WhatsApp | Ooasys`;
  if (niche === "shopping") return `Supermercados y Tiendas en ${region} con Domicilio | Ooasys`;
  if (niche === "moving") return `Trasteos y Mudanzas en ${region} | Ooasys`;
  if (niche === "tourism") return `Turismo y Aventura en ${region} Cuatrimotos | Ooasys`;
  if (niche === "agro") return `Agroinsumos y Veterinaria en ${region} | Ooasys`;
  return `${categoryName} en ${region} con 【entity-WhatsApp¦canonical_name=WhatsApp】 y Domicilio | Ooasys`;
}

function getDisplayTitle(categoryName: string, region: string, slug?: string): string {
  const niche = detectNiche(categoryName, slug);
  if (niche === "gifts") return `Detalles y Regalos en ${region}`;
  if (niche === "religion") return `Parroquias en ${region}`;
  if (niche === "desserts") return `Quieres Refrescarte en ${region}`;
  if (niche === "food") return `Donde Comer en ${region}`;
  if (niche === "home") return `Para el Hogar en ${region}`;
  if (niche === "health") return `Salud & Bienestar en ${region}`;
  if (niche === "financial") return `Servicios Financieros en ${region}`;
  if (niche === "fashion") return `Moda & Accesorios en ${region}`;
  if (niche === "emergency") return `Estaciones de Bomberos y Policía en ${region}`;
  if (niche === "fresh") return `Alimentos Frescos en ${region}`;
  if (niche === "campo") return `Todo para el Campo en ${region}`;
  if (niche === "services") return `Servicios Técnicos en ${region}`;
  if (niche === "nightlife") return `Licoreras y Bares en ${region}`;
  if (niche === "party") return `Noche & Diversión en ${region}`;
  if (niche === "adult") return `Arte Corporal & Sex Shop en ${region}`;
  if (niche === "internet") return `Tecnología y Conexión en ${region}`;
  if (niche === "transport") return `Mototaxis, Domicilios y Encomiendas en ${region}`;
  if (niche === "lodging") return `Hoteles, Hospedaje y Glamping en ${region}`;
  if (niche === "beauty") return `Barbería y Peluquería en ${region}`;
  if (niche === "shopping") return `Supermercados y Tiendas en ${region}`;
  if (niche === "moving") return `Trasteos y Mudanzas en ${region}`;
  if (niche === "tourism") return `Turismo y Aventura en ${region}`;
  if (niche === "agro") return `Agroinsumos y Veterinaria en ${region}`;
  return `${categoryName} en ${region}`;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const businesses = await getBusinessesBySlug(slug);
  const categoryName = resolveCategoryName(slug, businesses);
  const count = businesses.length;
  const title = getSeoTitle(categoryName, REGION, slug);
  const description = buildCategoryDescription(categoryName, count, REGION, slug);
  const url = `${baseUrl}/categorias/${slug}`;
  return {
    metadataBase: new URL(baseUrl),
    title: { absolute: title },
    description,
    applicationName: "Ooasys",
    alternates: { canonical: url, languages: { "es-CO": url, es: url } },
    robots: count === 0 ? { index: false, follow: true } : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    other: { "geo.region": "CO-ANT", "geo.placename": REGION },
    openGraph: { title, description, url, type: "website", siteName: "Ooasys", locale: "es_CO", images: [{ url: `${baseUrl}/og-categories.png`, width: 1200, height: 630, alt: `${categoryName} en ${REGION} - Ooasys` }] },
    twitter: { card: "summary_large_image", title, description, images: [`${baseUrl}/og-categories.png`] },
  };
}

export default async function CategoryBusinessPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const businesses = await getBusinessesBySlug(slug);
  const title = resolveCategoryName(slug, businesses);
  const url = `${baseUrl}/categorias/${slug}`;
  const categoryFaqs = getCategoryFaqs(title, REGION, slug);
  const displayTitle = getDisplayTitle(title, REGION, slug);
  const niche = detectNiche(title, slug);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name: `${displayTitle} - Occidente Antioqueño`,
    description: buildCategoryDescription(title, businesses.length, REGION, slug),
    url,
    inLanguage: "es-CO",
    isPartOf: { "@type": "WebSite", name: "Ooasys", url: baseUrl },
    areaServed: [...MUNICIPIOS.map((name) => ({ "@type": "City", name })), { "@type": "AdministrativeArea", name: "Occidente Antioqueño" }],
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: businesses.length,
      itemListElement: businesses.slice(0, 10).map((business: any, index: number) => {
        const businessSlug = getSlugText(business.slug);
        const locality = business.city || business.municipality?.name || REGION;
        const description = stripHtmlAndTruncate(business.description || "", 150);
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "LocalBusiness",
            name: business.name,
            ...(description && { description }),
            url: `${baseUrl}/business/${businessSlug}`,
            image: typeof business.logo === "string" && business.logo ? business.logo : `${baseUrl}/og-categories.png`,
            ...(business.phone && { telephone: business.phone }),
            address: { "@type": "PostalAddress", streetAddress: business.address || REGION, addressLocality: locality, addressRegion: "Antioquia", addressCountry: "CO" },
          },
        };
      }),
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Categorías", item: `${baseUrl}/categorias` },
      { "@type": "ListItem", position: 3, name: `${displayTitle}`, item: url },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categoryFaqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })),
  };

  return (
    <>
      <script id="category-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(collectionJsonLd) }} />
      <script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }} />
      <script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }} />
      <div className="container mx-auto px-4 py-8">
        <Link href="/categorias" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          Volver a categorías
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight font-heading md:text-4xl text-foreground">
            {displayTitle}
            {niche !== "religion" && (
              <span className="text-primary text-2xl md:text-3xl block md:inline font-normal font-sans"> con WhatsApp directo</span>
            )}
          </h1>
          <div className="mt-4 max-w-3xl">
            <p className="text-foreground/80 leading-relaxed">
              {niche === "gifts" ? (
                <>Encuentra <strong>{businesses.length} floristerías y boutiques en {REGION}</strong>. ¿Buscas detalles y regalos, rosas y arreglos florales en {MUNI_TEXT}? Pide directo por WhatsApp sin comisiones. Revisa fotos, ubicación y horarios.</>
              ) : niche === "religion" ? (
                <>Encuentra <strong>{businesses.length} parroquias e iglesias en {REGION}</strong>. ¿Buscas horarios de misa y servicios parroquiales en {MUNI_TEXT}? Revisa horarios, ubicación y servicios.</>
              ) : niche === "emergency" ? (
                <>Encuentra <strong>{businesses.length} bomberos y policía en {REGION}</strong>. ¿Buscas ayuda por incendios, robos o peleas en {MUNI_TEXT}? Contacta directo por WhatsApp. Emergencia 24h, revisa ubicación y horarios.</>
              ) : niche === "financial" ? (
                <>Encuentra <strong>{businesses.length} bancos y cajeros en {REGION}</strong>. ¿Buscas banco, cajero o retiro de plata en {MUNI_TEXT}? Contacta directo por WhatsApp. Revisa ubicación y horarios.</>
              ) : niche === "fashion" ? (
                <>Encuentra <strong>{businesses.length} almacenes de moda y joyería en {REGION}</strong>. ¿Buscas moda y estilo, ropa, tenis y joyería oro 18k en {MUNI_TEXT}? Contacta directo por WhatsApp sin comisiones. Revisa fotos y ubicación.</>
              ) : niche === "health" ? (
                <>Encuentra <strong>{businesses.length} farmacia, droguería, odontología, fisioterapia, gym y crossfit en {REGION}</strong>. ¿Buscas droguería con domicilio o gym en {MUNI_TEXT}? Pide medicamentos y agenda citas directo por WhatsApp.</>
              ) : niche === "food" ? (
                <>Encuentra <strong>{businesses.length} restaurantes, comidas rápidas y postres en {REGION}</strong>. ¿Buscas donde comer cerca del parque de {MUNI_TEXT}? ¿Con domicilio a fincas y veredas? Aquí los contactas directo por WhatsApp sin comisiones. Revisa menús, fotos y horarios.</>
              ) : niche === "home" ? (
                <>Encuentra <strong>{businesses.length} tiendas, supermercados y abarrotes en {REGION}</strong>. ¿Buscas mercado para el hogar en {MUNI_TEXT}? ¿Con domicilio a fincas y veredas? Pide abarrotes y mercado directo por WhatsApp sin comisiones.</>
              ) : niche === "party" ? (
                <>Encuentra <strong>{businesses.length} discotecas y bares en {REGION}</strong>. ¿Buscas farra y hora loca en {MUNI_TEXT}? ¿Discotecas con música en vivo? Contacta directo por WhatsApp. No hacemos domicilio, la rumba es en el lugar.</>
              ) : niche === "adult" ? (
                <>Encuentra <strong>{businesses.length} opciones de arte corporal & sex shop en {REGION}</strong>. ¿Buscas tatuajes, lubricantes, lencería y accesorios en {MUNI_TEXT}? Contacta directo por WhatsApp.</>
              ) : niche === "internet" ? (
                <>Encuentra <strong>{businesses.length} opciones de tecnología y conexión en {REGION}</strong>. ¿Buscas reparación y venta de celulares y computadores en {MUNI_TEXT}? ¿Instalación WiFi con planes hasta 120 mb en zona urbana y rural para fincas? Cotiza directo por WhatsApp.</>
              ) : niche === "nightlife" ? (
                <>Encuentra <strong>{businesses.length} licoreras y bares en {REGION}</strong>. ¿Buscas licorera con domicilio en {MUNI_TEXT}? ¿Cerveza, aguardiente y ron? ¿Bar con música en vivo? Contacta directo por WhatsApp sin comisiones.</>
              ) : niche === "fresh" ? (
                <>Encuentra <strong>{businesses.length} legumbrerías y charcuterías en {REGION}</strong>. ¿Buscas alimentos frescos, frutas, verduras y carnes en {MUNI_TEXT}? ¿Con domicilio a fincas y veredas? Pide directo por WhatsApp sin comisiones.</>
              ) : niche === "campo" ? (
                <>Encuentra <strong>{businesses.length} opciones de todo para el campo en {REGION}</strong>. ¿Buscas cuido y comida para perros, gatos, caballos y peces en {MUNI_TEXT}? ¿Agroinsumos para tu finca? Pide directo por WhatsApp sin comisiones.</>
              ) : niche === "services" ? (
                <>Encuentra <strong>{businesses.length} servicios técnicos en {REGION}</strong>. ¿Buscas taller mecánico de motos y carros en {MUNI_TEXT}? ¿Instalación y reparación de aires, neveras, estufas, redes de gas y eléctricas? Cotiza directo por WhatsApp sin comisiones.</>
              ) : niche === "desserts" ? (
                <>Encuentra <strong>{businesses.length} heladerías en {REGION}</strong> y todo el Occidente Antioqueño. ¿Buscas helados, salpicones, wafles y sandwiches en {MUNI_TEXT}? ¿Helado artesanal, salpicón de frutas, wafles con helado y sandwiches con domicilio a fincas y veredas? Aquí los pides directo por WhatsApp sin comisiones ni intermediarios. Revisa fotos, ubicación y horarios.</>
              ) : niche === "transport" ? (
                <>Encuentra <strong>{businesses.length} mototaxis, domicilios y encomiendas en {REGION}</strong> y todo el Occidente Antioqueño. ¿Buscas mototaxi cerca del parque de {MUNI_TEXT}? ¿Con domicilio a fincas y veredas? Aquí los contactas directo por WhatsApp sin comisiones ni intermediarios. Revisa fotos, ubicación y horarios.</>
              ) : niche === "lodging" ? (
                <>Encuentra <strong>{businesses.length} hoteles, hospedaje y glamping en {REGION}</strong> y todo el Occidente Antioqueño. ¿Buscas hotel en {MUNI_TEXT}? ¿Hospedaje y glamping con piscina en {REGION} para fin de semana? Mira fotos, ubicación y reserva directo por WhatsApp sin comisiones.</>
              ) : niche === "beauty" ? (
                <>Encuentra <strong>{businesses.length} barbería y peluquería en {REGION}</strong>. ¿Buscas barbería cerca del parque de {MUNI_TEXT}? ¿Peluquería y uñas en {REGION}? Agenda directo por WhatsApp sin comisiones.</>
              ) : niche === "shopping" ? (
                <>Encuentra <strong>{businesses.length} supermercados y tiendas en {REGION}</strong>. ¿Buscas supermercado cerca del parque? ¿Con domicilio a fincas y veredas? Contacta directo por WhatsApp.</>
              ) : niche === "tourism" ? (
                <>Encuentra <strong>{businesses.length} planes de turismo y aventura en {REGION}</strong>. ¿Buscas cuatrimotos, tramite de pasarportes, caminatas y aventura en {MUNI_TEXT}? Reserva directo por WhatsApp.</>
              ) : niche === "moving" ? (
                <>Encuentra <strong>{businesses.length} trasteos y mudanzas en {REGION}</strong>. ¿Buscas trasteo y transporte de carga en {MUNI_TEXT}? Cotiza directo por WhatsApp.</>
              ) : (
                <>Encuentra <strong>{businesses.length} opciones de {title.toLowerCase()} en {REGION}</strong> y todo el Occidente Antioqueño. ¿Buscas {title.toLowerCase()} cerca del parque de {MUNI_TEXT}? ¿Con domicilio a fincas y veredas? Aquí los contactas directo por WhatsApp sin comisiones ni intermediarios. Revisa fotos, ubicación y horarios.</>
              )}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {MUNICIPIOS.map((m) => {
                const municipioSlug = MUNICIPIOS_SLUG[m];
                return (
                  <Link key={m} href={`/categorias/${slug}/${municipioSlug}`} className="inline-flex items-center gap-1 text-xs border border-border bg-card hover:bg-accent px-3 py-1.5 rounded-full transition-colors">
                    <MapPin className="h-3 w-3" /> {m}
                  </Link>
                );
              })}
              <Link href="/mapa" className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full">Ver mapa del Occidente</Link>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 text-sm">{businesses.length} {businesses.length === 1 ? "negocio verificado" : "negocios verificados"} en {REGION} y alrededores.</p>
        </div>
        {businesses.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-border/50 bg-accent/10">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" aria-hidden="true" />
            <p className="text-lg font-medium text-muted-foreground">Aún no hay negocios en &quot;{displayTitle}&quot; en {REGION}</p>
            <p className="text-sm text-muted-foreground mt-1">Prueba en otro municipio del Occidente</p>
            <div className="flex gap-2 justify-center mt-4">
              {MUNICIPIOS.map(m => {
                const municipioSlug = MUNICIPIOS_SLUG[m];
                return (<Link key={m} href={`/categorias/${slug}/${municipioSlug}`} className="text-xs underline">{m}</Link>);
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business: any) => (<BusinessCard key={business._id} business={business} />))}
          </div>
        )}
        <section className="mt-16 pt-10 border-t border-border/60">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">Preguntas frecuentes sobre {displayTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryFaqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-card border border-border/50 shadow-sm">
                <h3 className="font-semibold text-foreground text-sm mb-2">{faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}