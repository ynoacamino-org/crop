import { Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "@/components/ui/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoginButton } from "@/modules/auth/components/ui/login-button";
import { LogoutButton } from "@/modules/auth/components/ui/logout-button";
import { useUser } from "@/providers/user-provider";
import { getInitials } from "@/shared/lib/utils";

export function AccountPopover() {
  const user = useUser();

  if (!user) {
    return <LoginButton />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full outline-none ring-offset-background transition-all hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || "User"}
              />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="font-medium leading-none">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t pt-4">
            {user.role === "ADMIN" && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Panel de Admin
                </Link>
              </Button>
            )}
            <LogoutButton />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
