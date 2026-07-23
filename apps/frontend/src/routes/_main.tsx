import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DynamicBreadcrumb } from "#/components/layout/dynamic-breadcrumb";
import { Navbar } from "#/components/layout/navbar";
import { getMe } from "@/routes/__root";

export const Route = createFileRoute("/_main")({
  beforeLoad: async ({ context, location }) => {
    const data = await context.queryClient.fetchQuery({
      queryKey: ["me"],
      queryFn: () => getMe(),
    });

    if (!data?.user) {
      throw redirect({
        to: "/iniciar-sesion",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: MainLayout,
});

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <DynamicBreadcrumb />
        <Outlet />
      </main>
    </div>
  );
}
