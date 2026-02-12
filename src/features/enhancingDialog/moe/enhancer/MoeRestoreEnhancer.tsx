import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";

import { MoeManager } from "@/domains/enhancement/moe/moeManager";
import { useMoeAutoRoll } from "@/hooks/useMoeAutoRoll";
import { StatParser } from "@/domains/autoRoll/moeAutoRollManager";
import { useMoeEnhancingContext } from "@/contexts/useMoeEnhancingContext";

import { Button } from "@/components/ui/button";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import CloseBtn from "@/components/CloseBtn";
import DisplayContainer from "../../DisplayContainer";
import MoeFooter from "../MoeFooter";

import Mask from "@/components/Mask";
import MoeAutoRoll from "@/features/autoRoll/moe/MoeAutoRoll";

export default function MoeRestoreEnhancer() {
  const { localData, setLocalData, handleClose } = useMoeEnhancingContext();
  const [after, setAfter] = useState<string[] | null>(null);

  const { potIds } = localData;

  const handleRoll = useCallback(() => {
    const newPots = MoeManager.rollPots("moeRestore", localData.subcategory);
    const stats = StatParser.parse(newPots);

    setAfter(newPots);
    setLocalData(
      produce((draft) => {
        if (draft) {
          draft!.statistics.counts.moeRestore =
            (draft?.statistics.counts.moeRestore || 0) + 1;
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

  const handleClick = (target: "before" | "after") => {
    if (!after) return;
    if (target === "after") {
      setLocalData(
        produce((draft) => {
          if (draft) {
            draft.potIds = after;
          }
        }),
      );
    }
    setAfter(null);
  };

  return (
    <>
      <div>
        Before
        <DisplayContainer
          onClick={() => handleClick("before")}
          className={cn(
            !!after && "hover:bg-glass/50 cursor-pointer transition-all",
          )}
        >
          {potIds.map((id, i) => (
            <PotentialLineBadge
              key={`${id}-${i}`}
              text={MoeManager.getLine(id)}
              className={cn("rounded p-1")}
            />
          ))}
        </DisplayContainer>
      </div>
      <div>
        After
        <DisplayContainer
          onClick={() => handleClick("after")}
          className={cn(
            !!after && "hover:bg-glass/50 cursor-pointer transition-all",
          )}
        >
          {after &&
            after.map((id, i) => (
              <PotentialLineBadge
                key={`${id}-${i}`}
                text={MoeManager.getLine(id)}
                className="rounded p-1"
              />
            ))}
        </DisplayContainer>
      </div>

      <MoeFooter>
        <CloseBtn disabled={!!after || isAutoRolling} onClose={handleClose} />
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
        <MoeAutoRoll targets={targets} setTargets={setTargets} />
      </Mask>
    </>
  );
}
