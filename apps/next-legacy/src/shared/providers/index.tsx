import { ThemeProvider } from "@/shared/providers/theme-provider";
import { UrqlProvider } from "@/shared/providers/urql";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UrqlProvider>{children}</UrqlProvider>
    </ThemeProvider>
  );
}
