"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BusinessError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-border/50 bg-background p-8 text-center shadow-warm">
        <AlertTriangle
          className="mx-auto mb-4 h-10 w-10 text-destructive"
          aria-hidden="true"
        />
        <h1 className="text-2xl font-bold font-heading">
          No pudimos cargar los negocios
        </h1>
        <p className="mt-2 text-muted-foreground">
          Intenta nuevamente para refrescar la informacion del directorio.
        </p>
        <Button type="button" className="mt-6" onClick={reset}>
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
