import { Button } from "@/components/ui/button";
import type { EhmMetadata } from "@/domains/enhancement/enhancement.type";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

type EhmCellProps = React.ComponentProps<"div"> & {
  item: EhmMetadata;
  count: number;
  isSelected?: boolean;
};

const formattedCount = new Intl.NumberFormat("zh-tw");

export default function EhmCell({
  item,
  count,
  isSelected = false,
  className,
  ...props
}: EhmCellProps) {
  const { imagePath, name } = item;
  return (
    <div className="flex flex-col items-center justify-center" {...props}>
      <div
        className={cn(
          "group",
          "bg-glass-light relative flex size-12 items-center justify-center rounded-sm text-black",
          className,
        )}
      >
        <Button
          size={"icon-xs"}
          variant={"ghost"}
          className={cn(
            "bg-secondary-lightest group-hover:bg-secondary-main absolute -top-2 -right-2 z-50 size-4 rounded-4xl",
            !isSelected && "hidden!",
          )}
        >
          <Check className="size-3 stroke-lime-600 group-hover:stroke-lime-700" />
        </Button>

        <img
          className={cn(
            "max-w-none cursor-pointer transition-all hover:scale-105",
          )}
          src={imagePath}
          alt={name}
        />
      </div>
      <p className="text-center">{formattedCount.format(count)}</p>
    </div>
  );
}
