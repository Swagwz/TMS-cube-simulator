import React from "react";
import { cn } from "@/lib/utils";

type MonoCounterProps = React.ComponentProps<"div"> & {
  imgUrl: string;
  alt: string;
  count: number;
};

const formattedCount = new Intl.NumberFormat("zh-tw");

export default function MonoCounter({
  imgUrl,
  alt,
  count,
  className,
  ...props
}: MonoCounterProps) {
  return (
    <div className="flex flex-col items-center justify-center" {...props}>
      <div
        className={cn(
          "group",
          "bg-glass-light flex size-12 items-center justify-center rounded-sm text-black",
          className,
        )}
      >
        <img
          className={cn(
            "max-w-none cursor-pointer transition-all hover:scale-105",
          )}
          src={imgUrl}
          alt={alt}
        />
      </div>
      <p className="text-center">{formattedCount.format(count)}</p>
    </div>
  );
}
