import { cn } from "@/lib/utils";
import React from "react";

export default function EhmGrid({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-glass-light flex flex-wrap gap-2 rounded-xl p-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
