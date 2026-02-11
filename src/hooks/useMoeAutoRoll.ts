import { useEffect, useMemo, useRef, useState } from "react";
import type {
  MoeAutoRollTarget,
  StatSummary,
} from "@/domains/autoRoll/autoRoll.type";
import { MoeAutoRollMatcher } from "@/domains/autoRoll/moeAutoRollManager";

type OnRollResult =
  | StatSummary
  | {
      summary: StatSummary;
      shouldStop?: boolean;
    };

type UseMoeAutoRollParams = {
  batchSize?: number;
  onRoll: () => OnRollResult;
  onMatch?: () => void;
};

export function useMoeAutoRoll({
  onRoll,
  onMatch,
  batchSize = 50,
}: UseMoeAutoRollParams) {
  const [targets, setTargets] = useState<MoeAutoRollTarget[]>([]);
  const [isAutoRolling, setIsAutoRolling] = useState(false);

  const onRollRef = useRef(onRoll);
  useEffect(() => {
    onRollRef.current = onRoll;
  });

  const matcher = useMemo(() => new MoeAutoRollMatcher(targets), [targets]);

  useEffect(() => {
    if (!isAutoRolling) return;

    let animationFrameId: number;

    const loop = () => {
      for (let i = 0; i < batchSize; i++) {
        const result = onRollRef.current();
        let summary: StatSummary;
        let shouldStop = false;

        if (result instanceof Map) {
          summary = result;
        } else {
          summary = result.summary;
          shouldStop = result.shouldStop ?? false;
        }

        if (matcher.isMatch(summary)) {
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
    targets,
    setTargets,
    isAutoRolling,
    setIsAutoRolling,
  };
}
