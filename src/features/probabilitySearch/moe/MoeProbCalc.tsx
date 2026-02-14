import React from "react";

import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import MoeAutoRoll from "@/features/autoRoll/moe/MoeAutoRoll";
import type { MoeAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";

type Props = {
  subcategory: MoeCardSubcategory;
  cube: MoeCubeId;
  targets: MoeAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<MoeAutoRollTarget[]>>;
};

export default function MoeProbCalc({
  subcategory,
  cube,
  targets,
  setTargets,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <MoeAutoRoll
        targets={targets}
        setTargets={setTargets}
        variant="paper"
        subcategory={subcategory}
        cubeId={cube}
      />
    </div>
  );
}
