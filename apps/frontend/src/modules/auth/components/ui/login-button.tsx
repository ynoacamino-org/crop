"use client";

import { Button } from "@/components/ui/button";
import Link from "@/components/ui/link";

export function LoginButton() {
  return (
    <Button asChild>
      <Link href="/iniciar-sesion">Iniciar sesión</Link>
    </Button>
  );
}
