import { UrqlProvider } from "./urql";

export function Providers({ children }: { children: React.ReactNode }) {
  return <UrqlProvider>{children}</UrqlProvider>;
}
