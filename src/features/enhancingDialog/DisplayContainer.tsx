import { cn } from "@/lib/utils";
import React from "react";

export default function DisplayContainer({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-glass flex min-h-44 flex-col justify-center gap-2 overflow-hidden rounded-md p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
