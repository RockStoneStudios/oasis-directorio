import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { generateWhatsAppUrl } from "@/lib/formatBusinessData";

interface WhatsAppButtonProps {
  phone?: string | null;
  businessName?: string;
  floating?: boolean;
}

export function WhatsAppButton({
  phone,
  businessName = "este negocio",
  floating = false,
}: WhatsAppButtonProps) {
  
  // 🛠️ Formateamos el número para asegurar el prefijo +57 de Colombia
  const formatColombiaPhone = (rawPhone: string | null | undefined) => {
    if (!rawPhone) return null;
    
    // Dejamos solo los números (limpia espacios, guiones, paréntesis y el "+")
    const cleaned = rawPhone.replace(/\D/g, "");
    
    // Si el usuario metió un celular normal de 10 dígitos (ej: 3101234567), le pegamos el 57
    if (cleaned.length === 10) {
      return `57${cleaned}`;
    }
    
    // Si ya tiene 12 dígitos (asumiendo que ya traía el 57 al inicio) lo dejamos tal cual
    return cleaned;
  };

  const formattedPhone = formatColombiaPhone(phone);

  const href = generateWhatsAppUrl(
    formattedPhone,
    `Hola, vi ${businessName} en Oasis y quiero más información.`,
  );

  if (!href) return null;

  // Clases base para el efecto neon y pulso
  const neonPulseClass = "animate-pulse shadow-[0_0_10px_rgba(37,211,102,0.5),0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_15px_rgba(37,211,102,0.7),0_0_25px_rgba(37,211,102,0.5)] transition-shadow duration-300";

  return (
    <Button
      asChild
      variant="success"
      size={floating ? "icon-lg" : "icon"}
      className={
        floating
          ? `fixed bottom-6 right-6 z-40 rounded-full shadow-warm-lg h-14 w-14 ${neonPulseClass}`
          : `rounded-full h-10 w-10 p-0 ${neonPulseClass}`
      }
    >
      <a href={href} target="_blank" rel="noreferrer">
        <SiWhatsapp className={floating ? "h-7 w-7" : "h-5 w-5"} aria-hidden="true" />
        <span className="sr-only">Contactar por WhatsApp</span>
      </a>
    </Button>
  );
}