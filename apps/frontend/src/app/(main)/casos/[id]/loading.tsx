import { Skeleton } from "@/shared/components/ui/skeleton";

export default function LegalCaseLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header skeleton */}
      <div className="space-y-4 border-b pb-6">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Info grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>

      {/* Content sections skeleton */}
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
