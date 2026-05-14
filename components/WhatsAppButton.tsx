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
  const href = generateWhatsAppUrl(
    phone,
    `Hola, vi ${businessName} en Oasis y quiero más información.`,
  );

  if (!href) return null;

  return (
    <Button
      asChild
      variant="success"
      size={floating ? "icon-lg" : "lg"}
      className={
        floating
          ? "fixed bottom-6 right-6 z-40 rounded-full shadow-warm-lg h-14 w-14" // Ajustado tamaño para el flotante
          : "w-full sm:w-fit gap-2" // Añadido gap para separar icono de texto
      }
    >
      <a href={href} target="_blank" rel="noreferrer">
        <SiWhatsapp className={floating ? "h-7 w-7" : "h-5 w-5"} aria-hidden="true" />
        {!floating && <span>WhatsApp</span>}
        {floating && <span className="sr-only">Contactar por WhatsApp</span>}
      </a>
    </Button>
  );
}