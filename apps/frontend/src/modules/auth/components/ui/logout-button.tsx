"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/modules/auth/lib/auth-client";

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
