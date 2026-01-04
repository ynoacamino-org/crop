"use client";

import { signIn } from "@/modules/auth/lib/auth-client";
import { Button } from "@/shared/components/ui/button";

export default function IniciarSesionPage() {
  return (
    <div>
      Iniciar Sesion Page
      <Button onClick={() => signIn.social({ provider: "google" })}>
        Hola
      </Button>
    </div>
  );
}
