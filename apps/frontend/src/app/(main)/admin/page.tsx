import { Scale, Users } from "lucide-react";
import Link from "next/link";
import {
  AdminStatsDocument,
  type AdminStatsQuery,
} from "@/service/gql/generated/gql.node";
import { getService } from "@/service/service.server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default async function AdminDashboardPage() {
  const { gql } = await getService();

  // Fetch statistics
  const result = await gql.query<AdminStatsQuery>(AdminStatsDocument, {});

  const stats = [
    {
      title: "Usuarios",
      value: result.data?.users?.pageInfo.totalCount || 0,
      description: "Usuarios registrados en el sistema",
      href: "/admin/usuarios",
    },
    {
      title: "Artículos",
      value: result.data?.articles?.pageInfo.totalCount || 0,
      description: "Artículos publicados",
      href: "/admin/articulos",
    },
    {
      title: "Casos Legales",
      value: result.data?.legalCases?.pageInfo.totalCount || 0,
      description: "Casos legales registrados",
      href: "/admin/casos",
    },
    {
      title: "Tipos de Casos",
      value: result.data?.caseTypes?.pageInfo.totalCount || 0,
      description: "Categorías de casos legales",
      href: "/admin/tipos-casos",
    },
  ];

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl tracking-tight">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">
          Gestiona usuarios, contenido y configuraciones del sistema
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-all hover:border-primary hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{stat.value}</div>
                <p className="text-muted-foreground text-xs">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid">
        <Card>
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
            <CardDescription>
              Acciones frecuentes de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/usuarios"
              className="block rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Gestionar Usuarios</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Ver y modificar roles de usuarios
              </p>
            </Link>
            <Link
              href="/admin/tipos-casos"
              className="block rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                <span className="font-medium">Tipos de Casos</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Crear y editar categorías de casos
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
