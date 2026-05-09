import { Star } from "lucide-react";

interface RatingStarsProps {
  rating?: number | null;
  reviews?: number | null;
  showValue?: boolean;
}

export function RatingStars({
  rating = 0,
  reviews,
  showValue = true,
}: RatingStarsProps) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="flex items-center gap-2" aria-label={`Calificacion ${value} de 5`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={`star-${index + 1}`}
            className={
              index < Math.round(value)
                ? "h-4 w-4 fill-primary text-primary"
                : "h-4 w-4 text-muted-foreground/40"
            }
            aria-hidden="true"
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium tabular-nums">
          {value.toFixed(1)}
          {typeof reviews === "number" && (
            <span className="text-muted-foreground font-normal">
              {" "}
              ({reviews})
            </span>
          )}
        </span>
      )}
    </div>
  );
}
