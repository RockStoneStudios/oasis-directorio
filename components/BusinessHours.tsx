"use client";

import { Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  formatDay,
  formatTime,
  getTodayHoursLabel,
  isBusinessOpenNow,
} from "@/lib/formatBusinessData";
import type { BusinessHours as Hours } from "@/types";

interface BusinessHoursProps {
  hours?: Hours[] | null;
}

export function BusinessHours({ hours }: BusinessHoursProps) {
  const [expanded, setExpanded] = useState(false);
  const openNow = isBusinessOpenNow(hours);

  return (
    <section className="rounded-2xl border border-border/50 bg-background p-6 shadow-warm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <Clock className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-semibold font-heading">Horario</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <span
                className={openNow ? "font-medium text-success" : "font-medium text-destructive"}
              >
                {openNow ? "Abierto ahora" : "Cerrado ahora"}
              </span>
              {" · "}
              {getTodayHoursLabel(hours)}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Ocultar" : "Ver todo"}
        </Button>
      </div>

      {expanded && (
        <div className="mt-5 space-y-2 border-t border-border/50 pt-5">
          {(hours || []).map((item) => (
            <div
              key={item.day}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="font-medium">{formatDay(item.day)}</span>
              <span className="text-muted-foreground tabular-nums">
                {item.isClosed
                  ? "Cerrado"
                  : `${formatTime(item.open)} - ${formatTime(item.close)}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
