import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  hasMore: boolean;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({
  page,
  hasMore,
  basePath = "/business",
  searchParams = {},
}: PaginationProps) {
  if (page <= 1 && !hasMore) return null;

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-3"
      aria-label="Paginacion"
    >
      <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
        {page > 1 ? (
          <Link href={buildHref(basePath, searchParams, page - 1)}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Anterior
          </Link>
        ) : (
          <span>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Anterior
          </span>
        )}
      </Button>

      <span className="rounded-lg border border-border/50 bg-background px-4 py-2 text-sm font-medium tabular-nums">
        Pagina {page}
      </span>

      <Button variant="outline" size="sm" disabled={!hasMore} asChild={hasMore}>
        {hasMore ? (
          <Link href={buildHref(basePath, searchParams, page + 1)}>
            Siguiente
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : (
          <span>
            Siguiente
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </Button>
    </nav>
  );
}

function buildHref(
  basePath: string,
  searchParams: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
