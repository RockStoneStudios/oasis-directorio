// @/components/BusinessHours.tsx
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BusinessHoursProps {
  hours?: any[] | null;
  isAlwaysOpen?: boolean;
}

export function BusinessHours({ hours, isAlwaysOpen }: BusinessHoursProps) {
  // 1. Detectar si es Abierto 24 Horas
  const alwaysOpen = isAlwaysOpen || hours?.some(h => h.isOpen === true && !h.day);

  if (alwaysOpen) {
    return (
      <section className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold font-heading">Horarios</h2>
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-none">
            Abierto 24 Horas
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Clock className="h-5 w-5 text-green-500" />
          <p className="text-sm">Servicio disponible las 24 horas, todos los días.</p>
        </div>
      </section>
    );
  }

  if (!hours || hours.length === 0) return null;

  // 🌟 2. NUEVO: Detectar si el usuario configuró un texto resumido completo
  // Buscamos si en el array viene algún elemento con useGlobalCustomText activo
  const globalCustomItem = hours.find(h => h.useGlobalCustomText === true && h.globalCustomText);

  if (globalCustomItem) {
    return (
      <section className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-bold font-heading">Horarios de Atención</h2>
        </div>
        
        {/* Renderiza tu string corrido perfectamente sin prefijos de días duplicados */}
        <div className="rounded-xl bg-accent/50 p-3.5 border border-border/30">
          <p className="text-sm font-semibold text-card-foreground leading-relaxed">
            {globalCustomItem.globalCustomText}
          </p>
        </div>
      </section>
    );
  }

  // Caso C: Mostrar la lista clásica tradicional día por día si no se usó el texto global
  return (
    <section className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
      <h2 className="mb-4 text-lg sm:text-xl font-bold font-heading">Horarios</h2>
      <div className="space-y-3">
        {hours.map((item) => {
          // Filtrar elementos vacíos o de configuración global interna para que no rompan la UI
          if (!item.day && !item.customText) return null;

          return (
            <div key={item._key} className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">
                {translateDay(item.day)}
              </span>
              
              {item.customText ? (
                <span className="font-semibold text-card-foreground bg-accent/40 px-2 py-0.5 rounded text-xs">
                  {item.customText}
                </span>
              ) : item.isClosed ? (
                <span className="text-destructive font-semibold">Cerrado</span>
              ) : (
                <span className="font-semibold text-card-foreground">
                  {item.open} - {item.close}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function translateDay(day: string) {
  if (!day) return "";
  const days: Record<string, string> = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
  };
  return days[day] || day;
}