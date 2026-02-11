import React from "react";
import { cva } from "class-variance-authority";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import { cn } from "@/lib/utils";
import { PotManager } from "@/domains/potential/potManager";

const bannerVariants = cva("p-0 text-center rounded", {
  variants: {
    variant: {
      rare: "bg-rank-rare text-rank-rare-fg",
      epic: "bg-rank-epic text-rank-epic-fg",
      unique: "bg-rank-unique text-rank-unique-fg",
      legendary: "bg-rank-legendary text-rank-legendary-fg",
    },
  },
});

export default function RankBanner({
  rank,
  className,
}: { rank: EquipmentRank } & React.ComponentProps<"div">) {
  return (
    <div className={cn(bannerVariants({ variant: rank }), className)}>
      {PotManager.rankToZh(rank)}
    </div>
  );
}
