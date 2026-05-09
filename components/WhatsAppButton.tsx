import { MessageCircle } from "lucide-react";
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
    `Hola, vi ${businessName} en Oasis y quiero mas informacion.`,
  );

  if (!href) return null;

  return (
    <Button
      asChild
      variant="success"
      size={floating ? "icon-lg" : "lg"}
      className={
        floating
          ? "fixed bottom-6 right-6 z-40 rounded-full shadow-warm-lg"
          : "w-full sm:w-fit"
      }
    >
      <a href={href} target="_blank" rel="noreferrer">
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        {!floating && <span>WhatsApp</span>}
        {floating && <span className="sr-only">Contactar por WhatsApp</span>}
      </a>
    </Button>
  );
}
