import { useEffect, useMemo, useRef, useState } from "react";
import type {
  EquipmentAutoRollTarget,
  StatSummary,
} from "@/domains/autoRoll/autoRoll.type";
import { EquipmentAutoRollMatcher } from "@/domains/autoRoll/equipAutoRollManager";
import type { EquipmentRank } from "@/domains/potential/potential.type";

type OnRollResult = {
  summary: StatSummary;
  currentRank: EquipmentRank;
  shouldStop?: boolean;
};

type UseEquipmentAutoRollParams = {
  batchSize?: number;
  onRoll: () => OnRollResult;
  onMatch?: () => void;
};

export function useEquipmentAutoRoll({
  onRoll,
  onMatch,
  batchSize = 50,
}: UseEquipmentAutoRollParams) {
  const [targetRank, setTargetRank] = useState<EquipmentRank | null>(null);
  const [targets, setTargets] = useState<EquipmentAutoRollTarget[]>([]);
  const [isAutoRolling, setIsAutoRolling] = useState(false);

  const onRollRef = useRef(onRoll);
  useEffect(() => {
    onRollRef.current = onRoll;
  });

  const matcher = useMemo(
    () => new EquipmentAutoRollMatcher(targets),
    [targets],
  );

  useEffect(() => {
    if (!isAutoRolling) return;

    let animationFrameId: number;

    const loop = () => {
      for (let i = 0; i < batchSize; i++) {
        const result = onRollRef.current();
        const { summary, currentRank, shouldStop } = result;

        if (matcher.isMatch(summary, currentRank)) {
          setIsAutoRolling(false);
          onMatch?.();
          return;
        }

        if (shouldStop) {
          break;
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoRolling, matcher, onMatch, batchSize]);

  return {
    targetRank,
    setTargetRank,
    targets,
    setTargets,
    isAutoRolling,
    setIsAutoRolling,
  };
}
