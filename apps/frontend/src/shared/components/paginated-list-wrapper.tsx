"use client";

import { useQueryParams } from "@/shared/lib/hooks/useQueryParams";
import { getPaginationInfo } from "@/shared/lib/layout/pagination-helpers";
import { cn } from "@/shared/lib/utils";
import { PaginationNavigator, PaginationSummary } from "./pagination-controls";

interface PaginatedListWrapperProps {
  children: React.ReactNode;
  totalItems: number;
  className?: string;
  showSummary?: boolean;
  emptyState?: React.ReactNode;
}

export function PaginatedListWrapper({
  children,
  totalItems,
  className,
  showSummary = true,
  emptyState,
}: PaginatedListWrapperProps) {
  const queryParams = useQueryParams();

  const { currentPage, pageLimit, totalPages, offset } = getPaginationInfo(
    queryParams,
    totalItems,
  );

  if (totalItems === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={cn("space-y-8", className)}>
      {children}

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4">
          {showSummary && (
            <PaginationSummary
              offset={offset}
              pageLimit={pageLimit}
              totalItems={totalItems}
            />
          )}
          <PaginationNavigator
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
