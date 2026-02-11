import { useState } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";

import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import { PotManager } from "@/domains/potential/potManager";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";

import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";

import DisplayContainer from "../../DisplayContainer";
import CloseBtn from "@/components/CloseBtn";
import EquipFooter from "../EquipFooter";
import { Crosshair } from "lucide-react";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";

export default function CombineCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("mainPot");
  const { level, mainPot, subcategory } = localData;
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [targetIndex, setTargetIndex] = useState(-1);

  const rollSlot = () => {
    setLocalData(
      produce((draft) => {
        draft!.statistics.counts.combineCube =
          (draft?.statistics.counts.combineCube || 0) + 1;
      }),
    );
    return rollWeightedIndex([1, 1, 1]);
  };

  const handleRollSlot = () => {
    const rolledIndex = rollSlot();
    setSelectedIndex(rolledIndex);
  };

  const rollPots = (index: number) => {
    const nextPotIds = [...mainPot.potIds];
    let isValid = false;
    while (!isValid) {
      const pots = CubeManager.rollPots("combineCube", mainPot.tier, pools);
      nextPotIds[index] = pots[index];
      isValid = PotManager.validateLineRules(nextPotIds);
    }
    return nextPotIds;
  };

  const handleApply = () => {
    if (selectedIndex === -1) return;

    const nextPotIds = rollPots(selectedIndex);

    setLocalData(
      produce((draft) => {
        draft!.mainPot.potIds = nextPotIds;
      }),
    );
    setSelectedIndex(-1);
  };

  const toggleTargetIndex = (index: number) => {
    if (selectedIndex !== -1) return;
    setTargetIndex((prev) => (prev === index ? -1 : index));
  };

  const handleTargetRoll = () => {
    if (targetIndex === -1) return;
    let rolledIndex = rollSlot();
    while (rolledIndex !== targetIndex) {
      rolledIndex = rollSlot();
    }
    const nextPotIds = rollPots(targetIndex);

    setLocalData(
      produce((draft) => {
        draft!.mainPot.potIds = nextPotIds;
      }),
    );
  };

  return (
    <>
      <DisplayContainer>
        {<RankBanner rank={mainPot.tier} />}
        {mainPot.potIds.map((id, i) => {
          const isTarget = targetIndex === i;
          const isSelected = selectedIndex === i;
          return (
            <div
              key={`${id}-${i}`}
              className={cn(
                "flex cursor-pointer flex-row items-center justify-between rounded p-1",
                (isTarget || isSelected) &&
                  "bg-accent-main text-accent-main-foreground",
              )}
              onClick={() => toggleTargetIndex(i)}
            >
              <PotentialLineBadge
                text={
                  PotManager.resolvePotential(id, level, subcategory).display
                }
                rank={PotManager.getPotentialMetadata(id).rank}
                className={cn("rounded p-1")}
              />
              <Button
                size={"icon-xs"}
                variant={"ghost"}
                className={cn(
                  "hover:bg-accent-dark hover:text-accent-dark-foreground",
                  isTarget &&
                    "hover:bg-accent-main hover:text-accent-main-foreground text-red-700",
                )}
              >
                <Crosshair />
              </Button>
            </div>
          );
        })}
      </DisplayContainer>

      <EquipFooter>
        <CloseBtn onClose={handleClose} />
        {targetIndex === -1 ? (
          <div className="flex flex-row gap-2">
            <Button variant="primary" onClick={handleRollSlot}>
              {selectedIndex === -1 ? "開始" : "再一次"}
            </Button>
            <Button
              variant="primary"
              disabled={selectedIndex === -1}
              onClick={handleApply}
            >
              使用
            </Button>
          </div>
        ) : (
          <Button variant="primary" onClick={handleTargetRoll}>
            使用
          </Button>
        )}
      </EquipFooter>
    </>
  );
}
