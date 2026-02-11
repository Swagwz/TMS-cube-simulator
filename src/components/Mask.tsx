import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/**
 *
 * @description Wraps children with a relative container and overlays a mask when disabled.
 * @example
 * <Mask disabled={shouldBlock}>
 *    {children}
 * </Mask>
 */
export default function Mask({ disabled = false, className, children }: Props) {
  return (
    <div className="relative">
      {children}
      <div
        className={cn(
          "absolute inset-0 z-50 rounded-md transition-colors duration-500",
          disabled
            ? "bg-glass/50 cursor-not-allowed"
            : "pointer-events-none bg-transparent",
          className,
        )}
      />
    </div>
  );
}
