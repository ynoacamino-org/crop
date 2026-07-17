import { useNavigate, useSearch } from "@tanstack/react-router";
import { getPaginationInfo } from "@/shared/lib/pagination";
import { cn } from "@/shared/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PaginationNavigatorProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function PaginationNavigator({
  currentPage,
  totalPages,
  className,
}: PaginationNavigatorProps) {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, unknown>;

  const goToPage = (page: number) => {
    const pageLimit = Number(searchParams.limit) || 12;
    const offset = (page - 1) * pageLimit;

    navigate({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        limit: pageLimit,
        offset,
      }),
    } as never);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                goToPage(currentPage - 1);
              }
            }}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(page);
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                goToPage(currentPage + 1);
              }
            }}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

interface PaginationSummaryProps {
  offset: number;
  pageLimit: number;
  totalItems: number;
  className?: string;
}

export function PaginationSummary({
  offset,
  pageLimit,
  totalItems,
  className,
}: PaginationSummaryProps) {
  const startItem = totalItems === 0 ? 0 : offset + 1;
  const endItem = Math.min(offset + pageLimit, totalItems);

  return (
    <div className={className}>
      <p className="text-muted-foreground text-sm">
        Mostrando <span className="font-medium">{startItem}</span> a{" "}
        <span className="font-medium">{endItem}</span> de{" "}
        <span className="font-medium">{totalItems}</span> resultados
      </p>
    </div>
  );
}

interface PaginationSectionProps {
  totalItems: number;
  className?: string;
  showInfo?: boolean;
}

export function PaginationSection({
  totalItems,
  className,
  showInfo = true,
}: PaginationSectionProps) {
  const searchParams = useSearch({ strict: false }) as Record<string, unknown>;

  const { currentPage, pageLimit, totalPages, offset } = getPaginationInfo(
    {
      limit: Number(searchParams.limit) || undefined,
      offset: Number(searchParams.offset) || undefined,
    },
    totalItems,
  );

  if (totalPages <= 1 && totalItems === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-8 flex flex-col items-center justify-between gap-4",
        className,
      )}
    >
      {showInfo && (
        <PaginationSummary
          offset={offset}
          pageLimit={pageLimit}
          totalItems={totalItems}
        />
      )}
      <PaginationNavigator currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
