import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { sdk } from "#/lib/graphql-client";

export const Route = createFileRoute("/_main/admin/")({
  loader: async () => {
    const data = await sdk.AdminStats();
    return {
      usersCount: data?.users?.pageInfo.totalCount || 0,
      articlesCount: data?.articles?.pageInfo.totalCount || 0,
      legalCasesCount: data?.legalCases?.pageInfo.totalCount || 0,
      caseTypesCount: data?.caseTypes?.pageInfo.totalCount || 0,
    };
  },
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { usersCount, articlesCount, legalCasesCount, caseTypesCount } =
    Route.useLoaderData();

  const stats = [
    {
      title: "Usuarios",
      value: usersCount,
      description: "Usuarios registrados en el sistema",
      href: "/admin/usuarios",
    },
    {
      title: "Artículos",
      value: articlesCount,
      description: "Artículos publicados",
      href: "/admin/articulos",
    },
    {
      title: "Casos Legales",
      value: legalCasesCount,
      description: "Casos legales registrados",
      href: "/admin/casos",
    },
    {
      title: "Tipos de Casos",
      value: caseTypesCount,
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
          <Link key={stat.title} to={stat.href}>
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
              to="/admin/usuarios"
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
              to="/admin"
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
