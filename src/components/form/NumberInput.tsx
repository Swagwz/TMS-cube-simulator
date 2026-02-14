import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"input">;

export default function NumberInput({ className, onFocus, ...props }: Props) {
  return (
    <Input
      type="number"
      inputMode="numeric"
      className={cn("text-center", className)}
      onFocus={(e) => e.target.select()}
      required
      {...props}
    />
  );
}
