import { Skeleton } from "@/components/ui/skeleton";

export function BusinessLoadingGrid({ titleWidth = "w-80" }: { titleWidth?: string }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-accent/20">
        <div className="border-b border-border/50 bg-background">
          <div className="container py-10">
            <Skeleton className="mb-4 h-5 w-32" />
            <Skeleton className={`h-10 ${titleWidth}`} />
          </div>
        </div>
        <div className="container grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={`directory-skeleton-${index}`} className="h-80 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
