import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/admin")({
  beforeLoad: ({ context }) => {
    const me = context.queryClient.getQueryData(["me"]) as any;
    if (me?.me?.role !== "ADMIN") {
      throw redirect({
        to: "/",
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  return <Outlet />;
}
