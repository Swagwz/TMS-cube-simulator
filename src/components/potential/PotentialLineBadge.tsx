import React from "react";
import type { PotentialRank } from "@/domains/potential/potential.type";
import RankBadge from "./RankBadge";
import { cn } from "@/lib/utils";

type PotentialLineBadgeProps = React.ComponentProps<"div"> & {
  text: string;
  rank?: PotentialRank;
};

export default function PotentialLineBadge({
  text,
  rank,
  className,
  ...props
}: PotentialLineBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-2 overflow-hidden",
        className,
      )}
      {...props}
    >
      {rank && <RankBadge rank={rank} />}
      <p className="truncate">{text}</p>
    </div>
  );
}
