import { useState } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";

import { PotManager } from "@/domains/potential/potManager";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import type { EquipmentRank } from "@/domains/potential/potential.type";

import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";
import RankBanner from "@/components/potential/RankBanner";

import DisplayContainer from "../../DisplayContainer";
import CloseBtn from "@/components/CloseBtn";
import EquipFooter from "../EquipFooter";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";

export default function RestoreAdditionalCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("additionalPot");
  const { level, additionalPot, subcategory } = localData;
  const [after, setAfter] = useState<{
    tier: EquipmentRank;
    potIds: string[];
  } | null>(null);

  const isRankUp = Boolean(after && after.tier !== additionalPot.tier);

  // 抽離計算邏輯：傳入 "當前潛能" (Base)，回傳 "洗完的結果"
  const performRoll = (basePot: { tier: EquipmentRank; potIds: string[] }) => {
    const nextRank = CubeManager.rollRankUp(
      "restoreAdditionalCube",
      basePot.tier,
    );
    const rolledPots = CubeManager.rollPots(
      "restoreAdditionalCube",
      nextRank,
      pools,
    );

    return { tier: nextRank, potIds: rolledPots };
  };

  const handleRoll = () => {
    // 第一次洗，Base 是目前的 additionalPot
    const result = performRoll(additionalPot);
    setAfter(result);

    // 增加方塊數
    setLocalData(
      produce((draft) => {
        draft!.statistics.counts.restoreAdditionalCube =
          (draft?.statistics.counts.restoreAdditionalCube || 0) + 1;
      }),
    );
  };

  const handleClick = (target: "before" | "after") => {
    if (!after) return;
    switch (target) {
      case "before":
        break;
      case "after":
        setLocalData(
          produce((draft) => {
            draft!.additionalPot = after;
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
          <RankBanner rank={additionalPot.tier} />
          {additionalPot.potIds.map((id, i) => {
            return (
              <PotentialLineBadge
                key={`${id}-${i}`}
                text={
                  PotManager.resolvePotential(id, level, subcategory).display
                }
                rank={PotManager.getPotentialMetadata(id).rank}
                className="rounded p-1"
              />
            );
          })}
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
          {after && <RankBanner rank={after.tier} />}
          {after &&
            after.potIds.map((id, i) => (
              <PotentialLineBadge
                key={`${id}-${i}`}
                text={
                  PotManager.resolvePotential(id, level, subcategory).display
                }
                rank={PotManager.getPotentialMetadata(id).rank}
                className="rounded p-1"
              />
            ))}
        </DisplayContainer>
      </div>

      <EquipFooter>
        <CloseBtn disabled={!!after} onClose={handleClose} />
        <Button variant="primary" disabled={isRankUp} onClick={handleRoll}>
          {!after || after.potIds.length === 0 ? "開始" : "再一次"}
        </Button>
      </EquipFooter>
    </>
  );
}
