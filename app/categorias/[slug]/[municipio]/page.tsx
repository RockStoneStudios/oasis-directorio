import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Store, HelpCircle, MapPin } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { BUSINESS_BY_SUBCATEGORY_QUERY } from "@/lib/sanity/queries";
import { BusinessCard } from "@/components/BusinessCard";

interface Props {
  params: Promise<{ slug: string; municipio: string }>;
}

export const revalidate = 3600;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.ooasys.com";

const MUNICIPIOS: Record<string, string> = {
  "sopetran": "Sopetrán",
  "san-jeronimo": "San Jerónimo",
  "santa-fe-de-antioquia": "Santa Fe de Antioquia",
  "liborina": "Liborina",
  "olaya": "Olaya",
};

const MUNICIPIOS_LIST = ["Sopetrán", "San Jerónimo", "Santa Fe de Antioquia", "Liborina", "Olaya"];
const MUNICIPIOS_SLUG: Record<string, string> = {
  "Sopetrán": "sopetran",
  "San Jerónimo": "san-jeronimo",
  "Santa Fe de Antioquia": "santa-fe-de-antioquia",
  "Liborina": "liborina",
  "Olaya": "olaya",
};

function formatMunicipio(slug: string) {
  return MUNICIPIOS[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}
function formatSlugText(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
}
function normalize(t: string) { return (t||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(); }
function stripHtmlAndTruncate(text: string, max: number) {
  if (!text) return "";
  const c = text.replace(/(<([^>]+)>)/gi,"").replace(/\s+/g," ").trim();
  return c.length > max ? c.substring(0,max-3).trimEnd()+"..." : c;
}
function toJsonLd(d: unknown){ return JSON.stringify(d).replace(/</g,"\\u003c"); }
function getSlugText(s:any){ return !s ? "" : typeof s==="object" ? s.current||"" : s; }

const getBusinessesBySlug = cache(async (slug: string) => {
  const result = await client.fetch(BUSINESS_BY_SUBCATEGORY_QUERY, { slug });
  return (result ?? []) as any[];
});

function resolveCategoryName(slug: string, businesses: any[]): string {
  const fallback = formatSlugText(slug);
  if (!businesses.length) return fallback;
  const first = businesses[0];
  return first.category?.slug?.current === slug ? first.category.name : first.subcategory?.name || first.category?.name || fallback;
}

function filterByMunicipio(businesses: any[], municipioSlug: string) {
  const nombre = formatMunicipio(municipioSlug);
  const target = normalize(nombre);
  return businesses.filter((b:any) => normalize(b.city || b.municipality?.name || "") === target);
}

function detectNiche(c: string, slug?: string) {
  const n = normalize(c);
  const s = normalize(slug || "");
  const has = (...w:string[]) => w.some(x=> n.includes(x) || s.includes(x));
  if (has("detalles y regalos","detalles-y-regalos","detalles","regalos","floristeria","boutique","floreria")) return "gifts";
  if (has("servicios financieros","servicios-financieros","financiero","banco","cajero","retiro de plata")) return "financial";
  if (has("moda & accesorios","moda-accesorios","moda","joyeria","almacen","ropa")) return "fashion";
  if (has("arte corporal","arte-corporal","sex shop","sexshop","tatuaje","tatuajes")) return "adult";
  if (has("noche & diversion","noche-diversion","noche","diversion","discoteca","farra","hora loca")) return "party";
  if (has("para el hogar","para-el-hogar","hogar","abarrotes")) return "home";
  if (has("tecnologia y conexion","tecnologia-y-conexion","tecnologia","conexion","celulares","computadores","wifi","internet")) return "internet";
  if (has("quieres refrescarte","quieres-refrescarte","refrescarte","refrescar","heladeria","helado","postre","dulce","salpicon","waffle","wafle","sandwich","crepes","malteada","frappe","dulceria")) return "desserts";
  if (has("alimentos frescos","alimentos-frescos","legumbreria","charcuteria","legumbres","carniceria")) return "fresh";
  if (has("todo para el campo","todo-para-el-campo","para el campo","cuido","concentrado")) return "campo";
  if (has("alojamiento","finca","glamping","hotel","hospedaje","bienes raices","cabaña","cabanas")) return "lodging";
  if (has("barberia","peluqueria","estetica","uñas","unas","spa","belleza")) return "beauty";
  if (has("restaurante & bar","licorera","rumba","licores","bares","licor")) return "nightlife";
  if (has("donde comer","donde-comer","restaurante","comidas rapidas","comida")) return "food";
  if (has("supermercado","tienda","mercado","minimercado")) return "shopping";
  if (has("trasteo","mudanza","carga","acarreo")) return "moving";
  if (has("mototaxi","domicilios","transporte","encomienda")) return "transport";
  if (has("farmacia","drogueria","odontologia","fisioterapia","salud","bienestar","gym","crossfit","dental","optica")) return "health";
  if (has("basicos","policia","bomberos","emergencia","servicios de emergencia")) return "emergency";
  if (has("fe y espiritualidad","fe-y-espiritualidad","fe","espiritualidad","religion","parroquia","iglesia","misa")) return "religion";
  if (has("turismo","viajes","aventura","caminata","cuatrimoto")) return "tourism";
  if (has("agroinsumo","agricola","fertilizante","veterinaria")) return "agro";
  if (has("servicios tecnicos","servicios-tecnicos","taller mecanico","aire acondicionado")) return "services";
  return "general";
}

function buildDesc(categoryName:string, count:number, municipio:string, slug?:string) {
  const n = count>0 ? `${count} ` : "";
  const map: Record<string,string> = {
    gifts: `${n}floristerias y boutiques en ${municipio} con rosas y arreglos florales. Detalles y regalos en ${municipio} por WhatsApp.`,
    food: `${n}restaurantes, comidas rapidas y postres en ${municipio} con domicilio a fincas y veredas. Donde comer en ${municipio} por WhatsApp.`,
    home: `${n}tiendas, supermercados y abarrotes en ${municipio} con mercado y productos para el hogar. Supermercado en ${municipio} con domicilio por WhatsApp.`,
    health: `${n}farmacia, drogueria, odontologia, fisioterapia, gym y crossfit en ${municipio} con domicilio. Medicamentos y citas por WhatsApp en ${municipio}.`,
    financial: `${n}bancos, cajeros y retiro de plata en ${municipio}. Banco y cajero en ${municipio} con ubicacion y horarios por WhatsApp.`,
    fashion: `${n}moda y estilo, ropa, tenis y joyeria oro 18k en ${municipio}. Almacen y joyeria en ${municipio} por WhatsApp.`,
    religion: `${n}parroquias e iglesias en ${municipio} con horarios de misa y servicios parroquiales. Parroquia en ${municipio}.`,
    emergency: `${n}bomberos y policia en ${municipio} para incendios, robos y peleas. Emergencia 24h en ${municipio} con contacto directo.`,
    nightlife: `${n}licoreras en ${municipio} con domicilio, horarios y WhatsApp directo. Cerveza, aguardiente y ron en ${municipio}.`,
    party: `${n}discotecas y bares en ${municipio} con farra y hora loca. Rumba en ${municipio} por WhatsApp.`,
    adult: `${n}tatuajes y sex shop en ${municipio} con lubricantes, dildos, lenceria y accesorios. Tatuajes en ${municipio} por WhatsApp.`,
    internet: `${n}reparacion y venta de celulares y computadores, venta de tecnologia y WiFi hasta 120 mb en ${municipio}. Instalacion WiFi urbana y rural para fincas por WhatsApp.`,
    services: `${n}taller mecanico de motos y carros en ${municipio}, reparacion de neveras, estufas y aires, redes de gas y electricas. Cotiza por WhatsApp.`,
    lodging: `${n}hoteles y hospedaje en ${municipio} con piscina, fincas y cabañas. Hoteles en ${municipio} con reserva directa por WhatsApp.`,
    beauty: `${n}barberia y peluqueria en ${municipio} con citas por WhatsApp. Corte, uñas y estética.`,
    transport: `${n}mototaxis y domicilios en ${municipio} 24h. Servicio rapido por WhatsApp.`,
    shopping: `${n}supermercados y tiendas en ${municipio} con domicilio a fincas y veredas.`,
    desserts: `${n}heladerias en ${municipio} con helados, salpicones, wafles y sandwiches. Helado artesanal, salpicon de frutas, wafles con helado y sandwiches con domicilio a fincas por WhatsApp.`,
    fresh: `${n}legumbreria y charcuteria en ${municipio}: frutas, verduras, carnes y alimentos frescos con domicilio a fincas y veredas. Pide por WhatsApp.`,
    campo: `${n}cuido y comida para perros, gatos, caballos y peces en ${municipio}, agroinsumos y concentrados para fincas. Pide por WhatsApp.`,
    general: `${n}${categoryName} en ${municipio} cerca del parque. Telefono y WhatsApp directo en Ooasys.`,
  };
  return stripHtmlAndTruncate(map[detectNiche(categoryName, slug)] || map.general, 155);
}

function getFaqs(categoryName:string, municipio:string, slug?:string) {
  const niche = detectNiche(categoryName, slug);
  if (niche === "gifts") {
    return [
      { q: `¿Dónde encontrar floristería en ${municipio}?`, a: `En Ooasys listamos floristerías y boutiques en ${municipio} con rosas y arreglos florales.` },
      { q: `¿Dónde comprar detalles y regalos en ${municipio}?`, a: `En Ooasys encuentras detalles, regalos, floristería y boutique en ${municipio} con rosas, arreglos florales y detalles personalizados.` },
      { q: `¿Cómo pedir un arreglo floral en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Pide rosas y arreglos florales directo." },
    ];
  }
  if (niche === "religion") {
    return [
      { q: `¿Dónde hay misa en ${municipio}?`, a: `En Ooasys listamos parroquias e iglesias en ${municipio} con horarios de misa y servicios parroquiales.` },
      { q: `¿Qué servicios parroquiales hay en ${municipio}?`, a: `En Ooasys encuentras servicios parroquiales en ${municipio}: bautizos, matrimonios, confesiones y horarios de misa.` },
      { q: `¿Dónde está la parroquia de ${municipio}?`, a: `Revisa la ficha de cada parroquia en Ooasys para ver su ubicación, horarios de misa y servicios.` },
    ];
  }
  if (niche === "food") {
    return [
      { q: `¿Dónde comer en ${municipio}?`, a: `En Ooasys listamos restaurantes, comidas rápidas y postres en ${municipio} con domicilio y WhatsApp directo, cerca del parque.` },
      { q: `¿Qué comidas rápidas en ${municipio} tienen domicilio?`, a: `La mayoría de restaurantes y comidas rápidas en ${municipio} hacen domicilio a fincas y veredas. Pide por WhatsApp.` },
      { q: `¿Dónde encontrar postres en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Pide postres, helados y comidas rápidas directo." },
    ];
  }
  if (niche === "home") {
    return [
      { q: `¿Dónde encontrar supermercado en ${municipio}?`, a: `En Ooasys listamos tiendas, supermercados y abarrotes en ${municipio} con domicilio y WhatsApp directo.` },
      { q: `¿Qué tiendas en ${municipio} venden abarrotes?`, a: `En Ooasys encuentras tiendas y supermercados en ${municipio} con abarrotes, mercado y productos para el hogar.` },
      { q: `¿Cómo pedir mercado a domicilio en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Pide abarrotes y mercado directo." },
    ];
  }
  if (niche === "health") {
    return [
      { q: `¿Dónde encontrar farmacia en ${municipio}?`, a: `En Ooasys listamos farmacia y droguería en ${municipio} con domicilio y WhatsApp directo.` },
      { q: `¿Dónde hay gym y crossfit en ${municipio}?`, a: `En Ooasys encuentras gym, crossfit, odontología y fisioterapia en ${municipio} con citas por WhatsApp.` },
      { q: `¿Cómo pedir medicamentos en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Pide medicamentos, agenda odontología y fisioterapia directo." },
    ];
  }
  if (niche === "financial") {
    return [
      { q: `¿Dónde hay bancos y cajeros en ${municipio}?`, a: `En Ooasys listamos bancos y cajeros en ${municipio} con retiro de plata y horarios.` },
      { q: `¿Dónde retirar plata en ${municipio}?`, a: `En Ooasys encuentras cajeros y bancos en ${municipio} para retiro de plata.` },
      { q: `¿Cómo contactar un banco en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Contacto directo." },
    ];
  }
  if (niche === "fashion") {
    return [
      { q: `¿Dónde comprar ropa en ${municipio}?`, a: `En Ooasys listamos moda y estilo, ropa y tenis en ${municipio} con tiendas y almacenes.` },
      { q: `¿Dónde comprar joyería oro 18k en ${municipio}?`, a: `En Ooasys encuentras joyería oro 18k y plata en ${municipio} con almacenes.` },
      { q: `¿Cómo contactar un almacén de moda en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Contacto directo." },
    ];
  }
  if (niche === "emergency") {
    return [
      { q: `¿Qué hacer si hay un incendio en ${municipio}?`, a: `En Ooasys listamos bomberos y policía en ${municipio} para incendios, robos y peleas con emergencia 24h.` },
      { q: `¿Dónde denunciar un robo en ${municipio}?`, a: `En Ooasys encuentras policía en ${municipio} para denunciar robos y peleas con contacto directo.` },
      { q: `¿Hay bomberos 24h en ${municipio}?`, a: `Sí, bomberos y policía en ${municipio} trabajan 24h. Revisa su ficha.` },
    ];
  }
  if (niche === "nightlife") {
    return [
      { q: `¿Dónde encontrar licorera en ${municipio}?`, a: `En Ooasys listamos licoreras y bares en ${municipio} con domicilio y WhatsApp directo. Cerveza, aguardiente y ron.` },
      { q: `¿Qué licoreras en ${municipio} tienen cerveza, aguardiente y ron?`, a: `La mayoría de licoreras en ${municipio} tienen cerveza, aguardiente y ron con domicilio a fincas y veredas.` },
      { q: `¿Cómo pedir licor a domicilio en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Pide cerveza, aguardiente y ron directo." },
    ];
  }
  if (niche === "party") {
    return [
      { q: `¿Dónde hay discotecas y bares en ${municipio}?`, a: `En Ooasys listamos discotecas y bares en ${municipio} con farra y hora loca.` },
      { q: `¿Qué bares en ${municipio} tienen farra y hora loca?`, a: `En Ooasys encuentras discotecas y bares en ${municipio} con farra, hora loca y música en vivo.` },
      { q: `¿Cómo contactar una discoteca en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Contacto directo, sin intermediarios." },
    ];
  }
  if (niche === "adult") {
    return [
      { q: `¿Dónde hacer tatuajes en ${municipio}?`, a: `En Ooasys listamos arte corporal y tatuajes en ${municipio} con citas por WhatsApp directo.` },
      { q: `¿Dónde comprar lencería y lubricantes en ${municipio}?`, a: `En Ooasys encuentras sex shop en ${municipio} con lubricantes, dildos, lencería y accesorios. Contacta por WhatsApp.` },
      { q: `¿Cómo contactar un sex shop en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Contacto directo y discreto." },
    ];
  }
  if (niche === "internet") {
    return [
      { q: `¿Dónde reparar celulares en ${municipio}?`, a: `En Ooasys listamos reparación y venta de celulares y computadores en ${municipio}.` },
      { q: `¿Dónde instalar WiFi en ${municipio} para fincas?`, a: `En Ooasys encuentras instalación WiFi en zona urbana y rural para fincas en ${municipio} con planes hasta 120 mb de velocidad.` },
      { q: `¿Cómo cotizar WiFi y tecnología en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Cotiza reparación de celulares, computadores y planes WiFi directo." },
    ];
  }
  if (niche === "fresh") {
    return [
      { q: `¿Dónde encontrar legumbrería en ${municipio}?`, a: `En Ooasys listamos legumbrerías y charcuterías en ${municipio} con frutas, verduras y carnes frescas con domicilio y WhatsApp directo, cerca del parque.` },
      { q: `¿Qué charcuterías en ${municipio} tienen domicilio?`, a: `La mayoría de legumbrerías y charcuterías en ${municipio} hacen domicilio a fincas y veredas.` },
      { q: `¿Cómo pedir alimentos frescos en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Pide frutas, verduras y carnes directo sin intermediarios." },
    ];
  }
  if (niche === "campo") {
    return [
      { q: `¿Dónde comprar cuido para perros en ${municipio}?`, a: `En Ooasys listamos cuido y comida para perros, gatos, caballos y peces en ${municipio} con domicilio y WhatsApp directo.` },
      { q: `¿Dónde encontrar agroinsumos en ${municipio}?`, a: `En Ooasys encuentras agroinsumos, concentrados y veterinaria en ${municipio} para fincas. Cotiza por WhatsApp.` },
      { q: `¿Cómo pedir cuido a domicilio en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Pide cuido directo." },
    ];
  }
  if (niche === "services") {
    return [
      { q: `¿Dónde encontrar taller mecánico en ${municipio}?`, a: `En Ooasys listamos talleres mecánicos de motos y carros en ${municipio} con reparación por WhatsApp directo.` },
      { q: `¿Quién repara neveras y aires en ${municipio}?`, a: `En Ooasys encuentras técnicos en ${municipio} para reparación de neveras, estufas y aires acondicionados.` },
      { q: `¿Quién instala redes de gas en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Cotiza redes de gas y eléctricas directo." },
    ];
  }
  if (niche === "desserts") {
    return [
      { q: `¿Dónde encontrar helados en ${municipio}?`, a: `En Ooasys listamos heladerías en ${municipio} con helados, salpicones, wafles y sandwiches con domicilio y WhatsApp directo, cerca del parque.` },
      { q: `¿Qué heladerías en ${municipio} tienen salpicón, wafles y sandwiches?`, a: `La mayoría de heladerías en ${municipio} tienen salpicón de frutas, wafles con helado, malteadas y sandwiches. Revisa cada ficha en Ooasys.` },
      { q: `¿Cómo pedir helado a domicilio en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Pide helados, salpicones, wafles y sandwiches directo sin intermediarios." },
    ];
  }
  if (niche === "transport") {
    return [
      { q: `¿Donde encontrar mototaxi en ${municipio}?`, a: `En Ooasys listamos mototaxis, domicilios y encomiendas en ${municipio} con telefono y WhatsApp directo.` },
      { q: `¿Cuánto vale un mototaxi en ${municipio}?`, a: `El precio depende de la distancia y si es dentro del pueblo o a una finca en ${municipio}. Escribele directo por WhatsApp al mototaxi en Ooasys y cotiza sin intermediarios.` },
      { q: `¿Hay mototaxis 24 horas en ${municipio}?`, a: `Si, varios mototaxis y domicilios en ${municipio} trabajan 24h. Revisa en su ficha su horario y WhatsApp.` },
    ];
  }
  if (niche === "lodging") {
    return [
      { q: `¿Dónde encontrar hoteles en ${municipio}?`, a: `En Ooasys listamos hoteles y hospedaje en ${municipio} con piscina, fotos y WhatsApp directo, cerca del parque.` },
      { q: `¿Hay hospedaje con piscina en ${municipio}?`, a: `Sí, la mayoría de hoteles y hospedaje en ${municipio} tienen piscina, BBQ y parqueadero. Revisa su ficha en Ooasys.` },
      { q: `¿Cómo reservar un hotel en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Reserva directa sin intermediarios ni comisiones." },
    ];
  }
  if (niche === "beauty") {
    return [
      { q: `¿Dónde encontrar barbería en ${municipio}?`, a: `En Ooasys listamos barbería y peluquería en ${municipio} con citas por WhatsApp.` },
      { q: `¿Dónde hacer uñas en ${municipio}?`, a: `En Ooasys encuentras peluquerías y estética en ${municipio} con servicio de uñas y corte. Contacta por WhatsApp.` },
      { q: `¿Cómo agendar en una barbería en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Agenda directa sin intermediarios." },
    ];
  }
  if (niche === "shopping") {
    return [
      { q: `¿Dónde encontrar supermercado en ${municipio}?`, a: `En Ooasys listamos supermercados y tiendas en ${municipio} con domicilio y WhatsApp directo.` },
      { q: `¿Qué tiendas en ${municipio} tienen domicilio?`, a: `La mayoría de supermercados y tiendas en ${municipio} hacen domicilio a fincas y veredas.` },
      { q: `¿Cómo contactar un supermercado en ${municipio}?`, a: "Usa el botón de WhatsApp en la ficha. Contacto directo." },
    ];
  }
  return [
    { q: `¿Donde encontrar ${categoryName} en ${municipio}?`, a: `En Ooasys listamos ${categoryName} en ${municipio} con telefono y WhatsApp directo.` },
    { q: `¿Como contactar ${categoryName} en ${municipio}?`, a: "Usa el boton de WhatsApp en la ficha. Contacto directo, sin intermediarios." },
    { q: `¿Hacen domicilio a fincas en ${municipio}?`, a: "Depende de cada negocio. Entra a su perfil y consultalo por WhatsApp." },
  ];
}

function getSeoTitle(categoryName:string, municipio:string, slug?:string) {
  const niche = detectNiche(categoryName, slug);
  if (niche === "gifts") return `Floristería y Boutique en ${municipio} Rosas | Ooasys`;
  if (niche === "religion") return `Parroquias en ${municipio} Horarios de Misa | Ooasys`;
  if (niche === "food") return `Restaurantes y Comidas Rápidas en ${municipio} | Ooasys`;
  if (niche === "home") return `Supermercados y Abarrotes en ${municipio} | Ooasys`;
  if (niche === "health") return `Farmacia, Odontología y Fisioterapia en ${municipio} | Ooasys`;
  if (niche === "financial") return `Bancos y Cajeros en ${municipio} Retiro de Plata | Ooasys`;
  if (niche === "fashion") return `Ropa, Tenis y Joyería Oro 18k en ${municipio} | Ooasys`;
  if (niche === "emergency") return `Bomberos y Policía en ${municipio} Incendios | Ooasys`;
  if (niche === "fresh") return `Legumbrería y Charcutería en ${municipio} | Ooasys`;
  if (niche === "campo") return `Cuido para Perros y Gatos en ${municipio} | Ooasys`;
  if (niche === "services") return `Taller Mecánico en ${municipio} Motos y Carros | Ooasys`;
  if (niche === "nightlife") return `Licoreras en ${municipio} Cerveza, Aguardiente y Ron | Ooasys`;
  if (niche === "party") return `Discotecas y Bares en ${municipio} Farra y Hora Loca | Ooasys`;
  if (niche === "adult") return `Tatuajes y Sex Shop en ${municipio} Lencería | Ooasys`;
  if (niche === "internet") return `Reparación de Celulares y WiFi 120 mb en ${municipio} | Ooasys`;
  if (niche === "desserts") return `Helados, Salpicones, Wafles y Sandwiches en ${municipio} | Ooasys`;
  if (niche === "transport") return `Mototaxis en ${municipio} 24h con WhatsApp | Ooasys`;
  if (niche === "lodging") return `Hoteles y Hospedaje en ${municipio} con Piscina | Ooasys`;
  if (niche === "beauty") return `Barbería y Peluquería en ${municipio} con WhatsApp | Ooasys`;
  if (niche === "shopping") return `Supermercados y Tiendas en ${municipio} con Domicilio | Ooasys`;
  return `${categoryName} en ${municipio} con WhatsApp | Ooasys`;
}

function getDisplayTitle(categoryName:string, municipio:string, slug?:string) {
  const niche = detectNiche(categoryName, slug);
  if (niche === "gifts") return `Detalles y Regalos en ${municipio}`;
  if (niche === "religion") return `Parroquias en ${municipio}`;
  if (niche === "desserts") return `Quieres Refrescarte en ${municipio}`;
  if (niche === "food") return `Donde Comer en ${municipio}`;
  if (niche === "home") return `Para el Hogar en ${municipio}`;
  if (niche === "health") return `Salud & Bienestar en ${municipio}`;
  if (niche === "financial") return `Servicios Financieros en ${municipio}`;
  if (niche === "fashion") return `Moda & Accesorios en ${municipio}`;
  if (niche === "emergency") return `Bomberos y Policía en ${municipio}`;
  if (niche === "fresh") return `Alimentos Frescos en ${municipio}`;
  if (niche === "campo") return `Todo para el Campo en ${municipio}`;
  if (niche === "services") return `Servicios Técnicos en ${municipio}`;
  if (niche === "nightlife") return `Licoreras en ${municipio}`;
  if (niche === "party") return `Noche & Diversión en ${municipio}`;
  if (niche === "adult") return `Arte Corporal & Sex Shop en ${municipio}`;
  if (niche === "internet") return `Tecnología y Conexión en ${municipio}`;
  if (niche === "transport") return `Mototaxis, Domicilios y Encomiendas en ${municipio}`;
  if (niche === "lodging") return `Hoteles y Hospedaje en ${municipio}`;
  if (niche === "beauty") return `Barbería y Peluquería en ${municipio}`;
  if (niche === "shopping") return `Supermercados y Tiendas en ${municipio}`;
  return `${categoryName} en ${municipio}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, municipio } = await params;
  const nombreMunicipio = formatMunicipio(municipio);
  const all = await getBusinessesBySlug(slug);
  const categoryName = resolveCategoryName(slug, all);
  const filtered = filterByMunicipio(all, municipio);
  const title = getSeoTitle(categoryName, nombreMunicipio, slug);
  const description = buildDesc(categoryName, filtered.length, nombreMunicipio, slug);
  const url = `${baseUrl}/categorias/${slug}/${municipio}`;
  return {
    metadataBase: new URL(baseUrl),
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: { "es-CO": url, es: url } },
    robots: filtered.length===0 ? { index:false, follow:true } : { index:true, follow:true },
    openGraph: { title, description, url, type:"website", siteName:"Ooasys", locale:"es_CO", images:[{url:`${baseUrl}/og-categories.png`, width:1200, height:630, alt:title}] },
    twitter: { card:"summary_large_image", title, description, images:[`${baseUrl}/og-categories.png`] },
  };
}

export default async function MunicipioPage({ params }: Props) {
  const { slug, municipio } = await params;
  const nombreMunicipio = formatMunicipio(municipio);
  const all = await getBusinessesBySlug(slug);
  const categoryName = resolveCategoryName(slug, all);
  const businesses = filterByMunicipio(all, municipio);
  const url = `${baseUrl}/categorias/${slug}/${municipio}`;
  const faqs = getFaqs(categoryName, nombreMunicipio, slug);
  const displayTitle = getDisplayTitle(categoryName, nombreMunicipio, slug);
  const niche = detectNiche(categoryName, slug);

  const jsonLd = {
    "@context":"https://schema.org","@type":"CollectionPage","@id":`${url}#webpage`,
    name:`${displayTitle}`, description: buildDesc(categoryName, businesses.length, nombreMunicipio, slug), url,
    isPartOf:{"@type":"WebSite", name:"Ooasys", url: baseUrl},
    areaServed:{"@type":"City", name: nombreMunicipio},
    mainEntity:{"@type":"ItemList", numberOfItems: businesses.length, itemListElement: businesses.slice(0,10).map((b:any,i:number)=>({
      "@type":"ListItem", position:i+1, item:{"@type":"LocalBusiness", name:b.name, url:`${baseUrl}/business/${getSlugText(b.slug)}`, address:{"@type":"PostalAddress", addressLocality: b.city || nombreMunicipio, addressRegion:"Antioquia", addressCountry:"CO"}}
    }))}
  };
  const breadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList", itemListElement:[
    {"@type":"ListItem", position:1, name:"Inicio", item: baseUrl},
    {"@type":"ListItem", position:2, name:"Categorías", item:`${baseUrl}/categorias`},
    {"@type":"ListItem", position:3, name:`${displayTitle} en Occidente Antioqueño`, item:`${baseUrl}/categorias/${slug}`},
    {"@type":"ListItem", position:4, name:`${displayTitle}`, item: url},
  ]};

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: toJsonLd(jsonLd)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: toJsonLd(breadcrumb)}} />
      <div className="container mx-auto px-4 py-8">
        <Link href={`/categorias/${slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4"/> Volver a {displayTitle} en Occidente
        </Link>
        <h1 className="text-3xl font-extrabold md:text-4xl">{displayTitle} {niche !== "religion" && <span className="text-primary text-2xl block md:inline font-normal">con WhatsApp directo</span>}</h1>
        <p className="mt-4 max-w-3xl text-foreground/80">
          {niche === "gifts" ? (
            <>Encuentra <strong>{businesses.length} floristerías y boutiques en {nombreMunicipio}</strong>. ¿Buscas detalles y regalos, rosas y arreglos florales en {nombreMunicipio}? Pide directo por WhatsApp sin comisiones. Revisa fotos, ubicación y horarios.</>
          ) : niche === "religion" ? (
            <>Encuentra <strong>{businesses.length} parroquias e iglesias en {nombreMunicipio}</strong>. ¿Buscas horarios de misa y servicios parroquiales en {nombreMunicipio}? Revisa horarios, ubicación y servicios.</>
          ) : niche === "food" ? (
            <>Encuentra <strong>{businesses.length} restaurantes, comidas rápidas y postres en {nombreMunicipio}</strong>. ¿Buscas donde comer cerca del parque de {nombreMunicipio}? ¿Con domicilio a fincas y veredas? Mira menús y contacta directo por WhatsApp sin comisiones.</>
          ) : niche === "home" ? (
            <>Encuentra <strong>{businesses.length} tiendas, supermercados y abarrotes en {nombreMunicipio}</strong>. ¿Buscas mercado para el hogar en {nombreMunicipio}? ¿Con domicilio a fincas y veredas? Pide abarrotes directo por WhatsApp.</>
          ) : niche === "health" ? (
            <>Encuentra <strong>{businesses.length} farmacia, droguería, odontología, fisioterapia, gym y crossfit en {nombreMunicipio}</strong>. ¿Buscas droguería o gym en {nombreMunicipio}? Pide medicamentos y agenda citas directo por WhatsApp.</>
          ) : niche === "financial" ? (
            <>Encuentra <strong>{businesses.length} bancos y cajeros en {nombreMunicipio}</strong>. ¿Buscas banco, cajero o retiro de plata en {nombreMunicipio}? Contacta directo por WhatsApp. Revisa ubicación y horarios.</>
          ) : niche === "fashion" ? (
            <>Encuentra <strong>{businesses.length} almacenes de moda y joyería en {nombreMunicipio}</strong>. ¿Buscas moda y estilo, ropa, tenis y joyería oro 18k en {nombreMunicipio}? Contacta directo por WhatsApp.</>
          ) : niche === "emergency" ? (
            <>Encuentra <strong>{businesses.length} bomberos y policía en {nombreMunicipio}</strong>. ¿Buscas ayuda por incendios, robos o peleas en {nombreMunicipio}? Contacta directo por WhatsApp. Emergencia 24h.</>
          ) : niche === "nightlife" ? (
            <>Encuentra <strong>{businesses.length} licoreras en {nombreMunicipio}</strong>. ¿Buscas cerveza, aguardiente y ron en {nombreMunicipio}? ¿Licorera con domicilio? Pide directo por WhatsApp.</>
          ) : niche === "party" ? (
            <>Encuentra <strong>{businesses.length} discotecas y bares en {nombreMunicipio}</strong>. ¿Buscas farra y hora loca en {nombreMunicipio}? ¿Discotecas con música en vivo? Contacta directo por WhatsApp. No hacemos domicilio, la rumba es en el lugar.</>
          ) : niche === "adult" ? (
            <>Encuentra <strong>{businesses.length} opciones de arte corporal & sex shop en {nombreMunicipio}</strong>. ¿Buscas tatuajes, lubricantes, dildos, lencería y accesorios en {nombreMunicipio}? Contacta directo por WhatsApp.</>
          ) : niche === "internet" ? (
            <>Encuentra <strong>{businesses.length} opciones de tecnología y conexión en {nombreMunicipio}</strong>. ¿Buscas reparación y venta de celulares y computadores en {nombreMunicipio}? ¿Instalación WiFi con planes hasta 120 mb en zona urbana y rural para fincas? Cotiza directo por WhatsApp.</>
          ) : niche === "fresh" ? (
            <>Encuentra <strong>{businesses.length} legumbrerías y charcuterías en {nombreMunicipio}</strong>. ¿Buscas frutas, verduras, carnes y alimentos frescos en {nombreMunicipio}? ¿Con domicilio a fincas y veredas? Pide directo por WhatsApp.</>
          ) : niche === "campo" ? (
            <>Encuentra <strong>{businesses.length} opciones de todo para el campo en {nombreMunicipio}</strong>. ¿Buscas cuido y comida para perros, gatos, caballos y peces en {nombreMunicipio}? ¿Agroinsumos para tu finca? Pide directo por WhatsApp.</>
          ) : niche === "services" ? (
            <>Encuentra <strong>{businesses.length} servicios técnicos en {nombreMunicipio}</strong>. ¿Buscas taller mecánico de motos y carros en {nombreMunicipio}? ¿Reparación de neveras, estufas, aires, redes de gas y eléctricas? Cotiza directo por WhatsApp.</>
          ) : niche === "desserts" ? (
            <>Encuentra <strong>{businesses.length} heladerías en {nombreMunicipio}</strong>. ¿Buscas helados, salpicones, wafles y sandwiches en {nombreMunicipio}? ¿Helado artesanal, salpicón de frutas, wafles con helado y sandwiches con domicilio a fincas y veredas? Pide directo por WhatsApp sin comisiones ni intermediarios.</>
          ) : niche === "transport" ? (
            <>Encuentra <strong>{businesses.length} mototaxis, domicilios y encomiendas en {nombreMunicipio}</strong>. ¿Buscas mototaxi cerca del parque de {nombreMunicipio}? ¿Con domicilio a fincas y veredas? Contacta directo por WhatsApp sin comisiones.</>
          ) : niche === "lodging" ? (
            <>Encuentra <strong>{businesses.length} hoteles y hospedaje en {nombreMunicipio}</strong>. ¿Buscas hotel en {nombreMunicipio} cerca del parque? ¿Hospedaje con piscina en {nombreMunicipio} para fin de semana? Mira fotos, ubicación y reserva directo por WhatsApp sin comisiones.</>
          ) : niche === "beauty" ? (
            <>Encuentra <strong>{businesses.length} barbería y peluquería en {nombreMunicipio}</strong>. ¿Buscas barbería cerca del parque de {nombreMunicipio}? ¿Peluquería y uñas en {nombreMunicipio}? Agenda directo por WhatsApp sin comisiones.</>
          ) : niche === "shopping" ? (
            <>Encuentra <strong>{businesses.length} supermercados y tiendas en {nombreMunicipio}</strong>. ¿Buscas supermercado cerca del parque de {nombreMunicipio}? ¿Con domicilio a fincas y veredas? Contacta directo por WhatsApp.</>
          ) : (
            <>Encuentra <strong>{businesses.length} opciones de {categoryName.toLowerCase()} en {nombreMunicipio}</strong>. ¿Buscas cerca del parque de {nombreMunicipio}? ¿Con domicilio a fincas y veredas? Contacta directo por WhatsApp sin comisiones.</>
          )}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {MUNICIPIOS_LIST.map(m=>{
            const s = MUNICIPIOS_SLUG[m];
            const active = s===municipio;
            return <Link key={m} href={`/categorias/${slug}/${s}`} className={active ? "inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full" : "inline-flex items-center gap-1 text-xs border px-3 py-1.5 rounded-full"}><MapPin className="h-3 w-3"/> {m}</Link>
          })}
        </div>
        <p className="text-muted-foreground mt-4 text-sm">{businesses.length} negocios verificados en {nombreMunicipio}.</p>
        {businesses.length===0 ? (
          <div className="text-center py-20 border border-dashed rounded-3xl mt-6"><Store className="h-12 w-12 mx-auto opacity-30"/><p className="mt-4">Aun no hay {displayTitle} en {nombreMunicipio}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">{businesses.map((b:any)=><BusinessCard key={b._id} business={b}/>)}</div>
        )}
        <section className="mt-16 pt-10 border-t">
          <h2 className="text-xl font-bold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary"/> Preguntas frecuentes sobre {displayTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">{faqs.map((f,i)=><div key={i} className="p-5 rounded-2xl border"><h3 className="font-semibold text-sm">{f.q}</h3><p className="text-xs text-muted-foreground mt-2">{f.a}</p></div>)}</div>
        </section>
      </div>
    </>
  );
}