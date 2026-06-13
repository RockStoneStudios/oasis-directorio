import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number | null | undefined;
  showValue?: boolean;
}

export function RatingStars({ rating, showValue = true }: RatingStarsProps) {
  // Si rating es null o undefined, usar 0 como valor por defecto
  const safeRating = rating ?? 0;
  
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex" aria-hidden="true">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-amber-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-amber-500">
          {safeRating.toFixed(1)}/5
        </span>
      )}
      <span className="sr-only">Calificación: {safeRating.toFixed(1)} de 5 estrellas</span>
    </div>
  );
}