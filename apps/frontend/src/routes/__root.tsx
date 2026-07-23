import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { Toaster } from "sonner";
import { ThemeProvider } from "#/providers/theme-provider";
import { UrqlProvider } from "#/providers/urql-provider";
import { UserProvider } from "#/providers/user-provider";
import { MeDocument } from "#/service/gql/generated/gql.node";
import { createServerService } from "#/service/service.server";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";

import appCss from "@/styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const getMe = createServerFn().handler(async () => {
  try {
    const { gql } = createServerService();
    const data = await gql.query(MeDocument, {});
    return { user: data?.data?.me || null };
  } catch {
    return { user: null };
  }
});

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Jurisprudencia Nacional - Sistema Legal Peruano",
      },
      {
        name: "description",
        content:
          "Plataforma de consulta de casos legales y jurisprudencia del sistema judicial peruano",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  loader: async () => {
    try {
      const data = await getMe();
      return {
        user: data.user || null,
      };
    } catch {
      return {
        user: null,
      };
    }
  },
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootComponent() {
  const { user } = Route.useLoaderData();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider user={user}>
        <UrqlProvider>
          <Outlet />
        </UrqlProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Toaster closeButton richColors position="top-right" />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
