import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="size-8" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Articles Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            {/* Image Skeleton */}
            <Skeleton className="aspect-video w-full" />

            <CardHeader>
              <div className="mb-2 flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-6 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>

            <CardFooter className="border-t pt-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
