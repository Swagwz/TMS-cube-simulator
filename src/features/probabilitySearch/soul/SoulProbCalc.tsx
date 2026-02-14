import React from "react";

import SoulAutoRoll from "@/features/autoRoll/soul/SoulAutoRoll";
import type { SoulAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";

type Props = {
  level: number;
  targets: SoulAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<SoulAutoRollTarget[]>>;
};

export default function SoulProbCalc({ level, targets, setTargets }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <SoulAutoRoll
        targets={targets}
        setTargets={setTargets}
        level={level}
        variant="paper"
      />
    </div>
  );
}
