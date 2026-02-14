import { useCallback } from "react";
import { produce } from "immer";

import { MoeManager } from "@/domains/enhancement/moe/moeManager";
import { useMoeAutoRoll } from "@/hooks/useMoeAutoRoll";

import { Button } from "@/components/ui/button";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import CloseBtn from "@/components/CloseBtn";
import DisplayContainer from "../../DisplayContainer";
import MoeFooter from "../MoeFooter";
import { useMoeEnhancingContext } from "@/contexts/useMoeEnhancingContext";
import { StatParser } from "@/domains/autoRoll/moeAutoRollManager";
import Mask from "@/components/Mask";
import MoeAutoRoll from "@/features/autoRoll/moe/MoeAutoRoll";

export default function MoeCubeEnhancer() {
  const { localData, setLocalData, handleClose } = useMoeEnhancingContext();
  const { potIds } = localData;

  const handleRoll = useCallback(() => {
    const newPots = MoeManager.rollPots("moeCube", localData.subcategory);
    const stats = StatParser.parse(newPots);
    setLocalData(
      produce((draft) => {
        if (draft) {
          draft.potIds = newPots;
          draft.statistics.counts.moeCube =
            (draft.statistics.counts.moeCube || 0) + 1;
        }
      }),
    );
    return stats;
  }, [localData.subcategory, setLocalData]);

  const { isAutoRolling, setIsAutoRolling, targets, setTargets } =
    useMoeAutoRoll({
      onRoll: handleRoll,
    });

  const handleStartAutoRoll = () => {
    setIsAutoRolling(true);
  };

  const handleStopAutoRoll = () => {
    setIsAutoRolling(false);
  };

  return (
    <>
      <DisplayContainer>
        {potIds.map((id, i) => (
          <PotentialLineBadge
            key={`${id}-${i}`}
            text={MoeManager.getLine(id)}
            className="rounded p-1"
          />
        ))}
      </DisplayContainer>
      <MoeFooter>
        <CloseBtn disabled={isAutoRolling} onClose={handleClose} />
        {isAutoRolling ? (
          <Button variant="destructive" onClick={handleStopAutoRoll}>
            停止
          </Button>
        ) : (
          <Button variant="primary" onClick={handleStartAutoRoll}>
            開始
          </Button>
        )}
      </MoeFooter>
      <Mask disabled={isAutoRolling}>
        <MoeAutoRoll
          targets={targets}
          setTargets={setTargets}
          subcategory={localData.subcategory}
          cubeId="moeCube"
        />
      </Mask>
    </>
  );
}
