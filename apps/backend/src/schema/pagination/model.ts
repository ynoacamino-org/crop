import { builder } from "@/builder";

// PaginationInfo type
export const PaginationInfo = builder.objectRef<{
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>("PaginationInfo");

PaginationInfo.implement({
  description: "Information about pagination",
  fields: (t) => ({
    totalCount: t.exposeInt("totalCount", {
      description: "Total number of items",
    }),
    hasNextPage: t.exposeBoolean("hasNextPage", {
      description: "Whether there is a next page",
    }),
    hasPreviousPage: t.exposeBoolean("hasPreviousPage", {
      description: "Whether there is a previous page",
    }),
  }),
});

// Helper to create paginated response types
export function createPaginatedResponse<T extends string>(
  name: T,
  itemType: string,
) {
  const paginatedRef = builder.objectRef<{
    items: unknown[];
    pageInfo: {
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>(`${name}Connection`);

  paginatedRef.implement({
    description: `Paginated list of ${itemType}`,
    fields: (t) => ({
      items: t.field({
        type: [itemType as never],
        resolve: (parent) => parent.items as never[],
      }),
      pageInfo: t.field({
        type: PaginationInfo,
        resolve: (parent) => parent.pageInfo,
      }),
    }),
  });

  return paginatedRef;
}

// Helper to calculate pagination info
export function calculatePaginationInfo(params: {
  totalCount: number;
  take: number;
  skip: number;
}): {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const { totalCount, take, skip } = params;

  return {
    totalCount,
    hasNextPage: skip + take < totalCount,
    hasPreviousPage: skip > 0,
  };
}
