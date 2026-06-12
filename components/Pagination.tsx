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

  // Generar números de página para mostrar (máximo 5)
  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = startPage + maxPages - 1;

    if (endPage > page + 2 && hasMore) {
      endPage = Math.min(endPage, page + 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="Paginación"
    >
      {/* Botón Anterior */}
      {page > 1 && (
        <Button
          variant="outline"
          size="default"
          asChild
          className="h-11 w-11 rounded-full border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#292524] text-[#44403C] dark:text-[#D6D3D1] hover:border-[#14B8A6] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all duration-300"
        >
          <Link href={buildHref(basePath, searchParams, page - 1)}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Página anterior</span>
          </Link>
        </Button>
      )}

      {/* Números de página */}
      <div className="flex gap-2">
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={pageNum === page ? "default" : "outline"}
            asChild={pageNum !== page}
            className={
              pageNum === page
                ? "h-10 w-10 rounded-full bg-gradient-to-r from-[#14B8A6] to-[#0F766E] text-white shadow-md hover:shadow-lg transition-all duration-300"
                : "h-10 w-10 rounded-full border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#292524] text-[#44403C] dark:text-[#D6D3D1] hover:border-[#14B8A6] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all duration-300"
            }
          >
            {pageNum === page ? (
              <span className="font-bold">{pageNum}</span>
            ) : (
              <Link href={buildHref(basePath, searchParams, pageNum)}>
                {pageNum}
              </Link>
            )}
          </Button>
        ))}
      </div>

      {/* Botón Siguiente */}
      {hasMore && (
        <Button
          variant="outline"
          size="default"
          asChild
          className="h-11 w-11 rounded-full border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#292524] text-[#44403C] dark:text-[#D6D3D1] hover:border-[#14B8A6] hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all duration-300"
        >
          <Link href={buildHref(basePath, searchParams, page + 1)}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Página siguiente</span>
          </Link>
        </Button>
      )}
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