"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export function LoginButton() {
  return (
    <Button asChild>
      <Link href="/iniciar-sesion">Iniciar sesión</Link>
    </Button>
  );
}
