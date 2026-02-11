import type { PotentialRank } from "@/domains/potential/potential.type";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

type RankBadgeProps = {
  rank: PotentialRank;
  className?: string;
};

export default function RankBadge({ rank, className }: RankBadgeProps) {
  return (
    <Badge
      variant={rank}
      className={cn("size-4 rounded font-mono font-extrabold", className)}
    >
      {rank[0].toUpperCase()}
    </Badge>
  );
}
