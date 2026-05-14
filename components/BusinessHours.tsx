// @/components/BusinessHours.tsx
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BusinessHoursProps {
  hours?: any[] | null;
  isAlwaysOpen?: boolean;
}

export function BusinessHours({ hours, isAlwaysOpen }: BusinessHoursProps) {
  // 1. Detectar si es 24 Horas
  // Es 24h si la prop es true O si existe un registro que diga isOpen: true sin tener un día asignado
  const alwaysOpen = isAlwaysOpen || hours?.some(h => h.isOpen === true && !h.day);

  // Caso A: Siempre Abierto (24/7)
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

  // Caso B: No hay horarios registrados
  if (!hours || hours.length === 0) return null;

  // Caso C: Mostrar lista de horarios por día
  return (
    <section className="rounded-2xl border border-border/50 bg-background p-5 sm:p-6 shadow-warm">
      <h2 className="mb-4 text-lg sm:text-xl font-bold font-heading">Horarios</h2>
      <div className="space-y-3">
        {hours.map((item) => (
          <div key={item._key} className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">
              {translateDay(item.day)}
            </span>
            {item.isClosed ? (
              <span className="text-destructive font-semibold">Cerrado</span>
            ) : (
              <span className="font-semibold text-card-foreground">
                {item.open} - {item.close}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// Función auxiliar para traducir los días que vienen de Sanity
function translateDay(day: string) {
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