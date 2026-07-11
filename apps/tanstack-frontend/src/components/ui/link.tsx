import { Link as RouterLink } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import type React from "react";
import { Button, type buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

function LinkComp({
  className,
  variant,
  size,
  children,
  href,
  to,
  tooltip,
  ...props
}: React.ComponentProps<typeof RouterLink> &
  VariantProps<typeof buttonVariants> & {
    href?: string;
    tooltip?: React.ReactNode;
  }) {
  const targetTo = to || href || "";
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      tooltip={tooltip}
      className={cn("py-1 font-medium text-sm", className)}
    >
      <RouterLink to={targetTo} {...props}>
        {children}
      </RouterLink>
    </Button>
  );
}

export { LinkComp as Link };
export default LinkComp;
