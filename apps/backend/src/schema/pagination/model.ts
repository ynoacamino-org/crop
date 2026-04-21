import { builder } from "@/builder";
import { db } from "@/lib/db";

interface PaginationInfoShape {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationParentShape {
  take: number;
  skip: number;
}

type CountSource = Parameters<typeof db.$count>[0];
type CountFilter = Parameters<typeof db.$count>[1];

// PaginationInfo type
export const PaginationInfo =
  builder.objectRef<PaginationInfoShape>("PaginationInfo");

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

// Helper to calculate pagination info
export function calculatePaginationInfo(params: {
  totalCount: number;
  take: number;
  skip: number;
}): PaginationInfoShape {
  const { totalCount, take, skip } = params;

  return {
    totalCount,
    hasNextPage: skip + take < totalCount,
    hasPreviousPage: skip > 0,
  };
}

export function createPageInfoResolver<
  TParent extends PaginationParentShape,
>(options: {
  getTotalCount: (parent: TParent) => Promise<number>;
  onError?: (error: unknown) => never;
}): (parent: TParent) => Promise<PaginationInfoShape> {
  return async (parent) => {
    try {
      const totalCount = await options.getTotalCount(parent);

      return calculatePaginationInfo({
        totalCount,
        take: parent.take,
        skip: parent.skip,
      });
    } catch (error) {
      if (options.onError) {
        return options.onError(error);
      }

      throw error;
    }
  };
}

export function createDbCountPageInfoResolver<
  TParent extends PaginationParentShape,
>(options: {
  source: CountSource;
  where?: (parent: TParent) => CountFilter | Promise<CountFilter>;
  onError?: (error: unknown) => never;
}): (parent: TParent) => Promise<PaginationInfoShape> {
  return createPageInfoResolver<TParent>({
    getTotalCount: async (parent) => {
      const whereClause = options.where
        ? await options.where(parent)
        : undefined;

      return await db.$count(options.source, whereClause);
    },
    onError: options.onError,
  });
}
