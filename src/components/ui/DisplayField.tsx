import React, { type JSX } from "react";
import { cn } from "@/lib/utils";

export default function DisplayField({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { label: string | JSX.Element }) {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center gap-2 py-2 leading-none",
        className,
      )}
      {...props}
    >
      <div className="text-glass-foreground text-sm font-medium">{label}</div>
      <span className="text-glass-foreground text-sm font-medium">:</span>
      <div className="text-sm">{children}</div>
    </div>
  );
}
