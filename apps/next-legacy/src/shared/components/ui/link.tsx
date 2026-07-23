import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type React from "react";
import { Button, type buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

/**
 * LinkComp component
 *
 * A link component that combines Next.js Link with Button styling.
 * Renders as a button-styled link using the Button component's variants.
 *
 * @param props - Link component props
 * @param props.className - Additional CSS classes
 * @param props.variant - Button variant styling
 * @param props.size - Button size variant
 * @param props.children - Link content
 * @param props.href - URL to navigate to
 * @returns The rendered link component
 *
 * @example
 * ```tsx
 * <Link href="/dashboard" variant="default" size="lg">
 *   Go to Dashboard
 * </Link>
 *
 * <Link href="/profile" variant="outline" size="sm">
 *   View Profile
 * </Link>
 *
 * <Link href="/settings" variant="ghost">
 *   Settings
 * </Link>
 * ```
 */
function LinkComp({
  className,
  variant,
  size,
  children,
  href,
  tooltip,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof buttonVariants> & {
    tooltip?: React.ReactNode;
  }) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      tooltip={tooltip}
      className={cn("py-1 font-medium text-sm", className)}
    >
      <Link href={href ?? ""} {...props}>
        {children}
      </Link>
    </Button>
  );
}

export { LinkComp as Link };
