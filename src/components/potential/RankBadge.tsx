import type { ComponentProps, ReactNode } from "react";
import type { PotentialRank } from "@/domains/potential/potential.type";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { capitalize } from "@/utils/capitalize";

const rankBadgeClassName: Record<PotentialRank, string> = {
  normal: "bg-rank-normal text-rank-normal-fg",
  rare: "bg-rank-rare text-rank-rare-fg",
  epic: "bg-rank-epic text-rank-epic-fg",
  unique: "bg-rank-unique text-rank-unique-fg",
  legendary: "bg-rank-legendary text-rank-legendary-fg",
};

type RankBadgeProps = Omit<ComponentProps<typeof Badge>, "children"> & {
  rank: PotentialRank;
  labelMode?: "short" | "full";
  children?: ReactNode;
};

export default function RankBadge({
  rank,
  className,
  labelMode = "short",
  children,
  ...props
}: RankBadgeProps) {
  const isFull = labelMode === "full";
  const text = capitalize(rank);
  return (
    <Badge
      className={cn(
        "rounded border-0 font-mono font-extrabold outline-1 outline-white/50",
        !isFull && "size-4",
        rankBadgeClassName[rank],
        className,
      )}
      {...props}
    >
      {isFull ? text : text[0]}
    </Badge>
  );
}
