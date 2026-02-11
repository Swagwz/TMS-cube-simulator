import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const lineVariants = cva("list-inside list-[square]", {
  variants: {
    variant: {
      normal: "marker:text-rank-normal",
      rare: "marker:text-rank-rare",
      epic: "marker:text-rank-epic",
      unique: "marker:text-rank-unique",
      legendary: "marker:text-rank-legendary",
    },
  },
});

export default function PotentialLineMarker({
  className,
  children,
  variant,
  ...props
}: VariantProps<typeof lineVariants> & React.ComponentProps<"li">) {
  return (
    <li className={cn(lineVariants({ variant }), className)} {...props}>
      {children}
    </li>
  );
}
