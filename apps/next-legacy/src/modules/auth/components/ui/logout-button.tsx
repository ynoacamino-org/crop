"use client";

import { signOut } from "@/modules/auth/lib/auth-client";
import { Button } from "@/shared/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      onClick={() => {
        signOut();
        window.location.href = "/iniciar-sesion";
      }}
      variant={"destructive"}
    >
      Sign Out
    </Button>
  );
}
