import { ServerUserProvider } from "./server-providers";
import { UrqlProvider } from "./urql";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ServerUserProvider>
      <UrqlProvider>{children}</UrqlProvider>
    </ServerUserProvider>
  );
}
