import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/admin")({
  beforeLoad: ({ context }) => {
    const me = context.queryClient.getQueryData<{ me: { role: string } }>([
      "me",
    ]);
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
