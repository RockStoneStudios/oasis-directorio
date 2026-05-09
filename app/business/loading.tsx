import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessLoading() {
  return (
    <div className="bg-accent/20">
      <div className="border-b border-border/50 bg-background">
        <div className="container py-10">
          <Skeleton className="mb-4 h-5 w-32" />
          <Skeleton className="h-10 w-72" />
          <Skeleton className="mt-3 h-5 w-full max-w-xl" />
        </div>
      </div>
      <div className="container grid gap-8 py-8 lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-96 rounded-2xl" />
        <div className="space-y-6">
          <Skeleton className="h-20 rounded-2xl" />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={`business-card-skeleton-${index}`} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
