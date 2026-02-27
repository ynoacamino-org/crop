// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { Calendar, Eye, User } from "lucide-react";
// import Link from "next/link";
// import { Badge } from "@/shared/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/shared/components/ui/card";

// interface ArticleCardProps {
//   id: string;
//   title: string;
//   slug: string;
//   excerpt?: string;
//   author: {
//     name: string;
//   };
//   status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
//   publishedAt?: Date | null;
//   views: number;
//   readingTimeMin: number;
//   categories?: Array<{ name: string }>;
//   featuredImage?: {
//     url: string;
//     alt?: string;
//   } | null;
// }

// const statusLabels = {
//   DRAFT: "Borrador",
//   PUBLISHED: "Publicado",
//   ARCHIVED: "Archivado",
// };

// const statusColors = {
//   DRAFT: "default",
//   PUBLISHED: "success",
//   ARCHIVED: "secondary",
// } as const;

// export function ArticleCard({
//   id,
//   title,
//   slug,
//   excerpt,
//   author,
//   status,
//   publishedAt,
//   views,
//   readingTimeMin,
//   categories,
//   featuredImage,
// }: ArticleCardProps) {
//   return (
//     <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
//       {featuredImage && (
//         <div className="relative h-48 w-full overflow-hidden bg-muted">
//           <img
//             src={featuredImage.url}
//             alt={featuredImage.alt || title}
//             className="h-full w-full object-cover transition-transform hover:scale-105"
//           />
//         </div>
//       )}

//       <CardHeader>
//         <div className="mb-2 flex items-center gap-2">
//           <Badge variant={statusColors[status]}>{statusLabels[status]}</Badge>
//           {categories && categories.length > 0 && (
//             <>
//               {categories.slice(0, 2).map((category, index) => (
//                 <Badge key={index} variant="outline">
//                   {category.name}
//                 </Badge>
//               ))}
//             </>
//           )}
//         </div>

//         <Link href={`/articles/${slug}`} className="hover:underline">
//           <CardTitle className="line-clamp-2">{title}</CardTitle>
//         </Link>

//         {excerpt && (
//           <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
//         )}
//       </CardHeader>

//       <CardContent className="flex-1">
//         <div className="flex flex-col gap-2 text-muted-foreground text-sm">
//           <div className="flex items-center gap-2">
//             <User className="size-4" />
//             <span>{author.name}</span>
//           </div>

//           {publishedAt && (
//             <div className="flex items-center gap-2">
//               <Calendar className="size-4" />
//               <span>
//                 {format(new Date(publishedAt), "d 'de' MMMM, yyyy", {
//                   locale: es,
//                 })}
//               </span>
//             </div>
//           )}

//           <div className="flex items-center gap-2">
//             <Eye className="size-4" />
//             <span>
//               {views} vistas · {readingTimeMin} min de lectura
//             </span>
//           </div>
//         </div>
//       </CardContent>

//       <CardFooter className="gap-2">
//         <Link
//           href={`/articles/${slug}`}
//           className="text-primary text-sm hover:underline"
//         >
//           Leer artículo →
//         </Link>
//       </CardFooter>
//     </Card>
//   );
// }
