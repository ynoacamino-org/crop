import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

interface RelatedLegalCaseCardProps {
  slug: string;
  caseName: string;
  caseNumber: string;
  jurisdiction?: string | null;
  caseType?: string | null;
}

export function RelatedLegalCaseCard({
  slug,
  caseName,
  caseNumber,
  jurisdiction,
  caseType,
}: RelatedLegalCaseCardProps) {
  return (
    <Link href={`/casos/${slug}`} className="group">
      <Card className="transition-all hover:border-primary/50">
        <CardHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {caseType && (
              <Badge variant="secondary" className="text-xs">
                {caseType}
              </Badge>
            )}
            {jurisdiction && (
              <Badge variant="outline" className="text-xs">
                {jurisdiction}
              </Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2 transition-colors group-hover:text-primary">
            {caseName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-muted-foreground text-sm">
            {caseNumber}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
