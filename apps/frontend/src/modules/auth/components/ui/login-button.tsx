import { Button } from "@/shared/components/ui/button";
import Link from "@/shared/components/ui/link";

export function LoginButton() {
  return (
    <Button asChild>
      <Link href="/iniciar-sesion">Iniciar sesión</Link>
    </Button>
  );
}
