import { useState } from "react";
import { produce } from "immer";
import { cn } from "@/lib/utils";

import { PotManager } from "@/domains/potential/potManager";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";

import DisplayContainer from "../../DisplayContainer";
import CloseBtn from "@/components/CloseBtn";
import EquipFooter from "../EquipFooter";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";

export default function HexaCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("mainPot");
  const { level, mainPot, subcategory } = localData;
  const [hexaPots, setHexaPots] = useState<string[]>([]);
  const [selectedPots, setSelectedPots] = useState<
    { id: string; index: number }[]
  >([]);

  const handleRoll = () => {
    const nextRank = CubeManager.rollRankUp("hexaCube", mainPot.tier);
    const rolledPots = CubeManager.rollPots("hexaCube", nextRank, pools);
    setLocalData(
      produce((draft) => {
        draft!.mainPot.tier = nextRank;
        draft!.statistics.counts.hexaCube =
          (draft?.statistics.counts.hexaCube || 0) + 1;
      }),
    );
    setHexaPots(rolledPots);
    setSelectedPots([]);
  };

  const toggleSelect = (id: string, i: number) => {
    setSelectedPots(
      produce((draft) => {
        // 重複選中->刪除
        if (draft.some((selected) => selected.index === i)) {
          draft = draft.filter((selected) => selected.index !== i);
          return draft;
        }
        // 已滿3個
        if (draft.length === 3) return draft;
        else draft.push({ id, index: i });
      }),
    );
  };

  const handleConfirm = () => {
    setLocalData(
      produce((draft) => {
        draft!.mainPot.potIds = selectedPots.map(({ id }) => id);
      }),
    );
    setHexaPots([]);
    setSelectedPots([]);
  };

  return (
    <>
      <DisplayContainer className="min-h-76">
        {<RankBanner rank={mainPot.tier} />}
        {hexaPots.length === 0
          ? mainPot.potIds.map((id, i) => (
              <PotentialLineBadge
                key={`${id}-${i}`}
                text={
                  PotManager.resolvePotential(id, level, subcategory).display
                }
                rank={PotManager.getPotentialMetadata(id).rank}
                className="rounded p-1"
              />
            ))
          : hexaPots.map((id, i) => (
              <PotentialLineBadge
                key={`${id}-${i}`}
                text={
                  PotManager.resolvePotential(id, level, subcategory).display
                }
                rank={PotManager.getPotentialMetadata(id).rank}
                onClick={() => toggleSelect(id, i)}
                className={cn(
                  "cursor-pointer rounded p-1",
                  selectedPots.some(({ index }) => index === i) &&
                    "bg-accent-main text-accent-main-foreground",
                )}
              />
            ))}
      </DisplayContainer>
      <EquipFooter>
        <CloseBtn disabled={!!hexaPots.length} onClose={handleClose} />
        {selectedPots.length === 3 ? (
          <Button variant="primary" onClick={handleConfirm}>
            確定
          </Button>
        ) : (
          <Button variant="primary" onClick={handleRoll}>
            {hexaPots.length === 0 ? "開始" : "再一次"}
          </Button>
        )}
      </EquipFooter>
    </>
  );
}
