import { useState } from "react";
import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import CloseBtn from "@/components/CloseBtn";
import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";
import { PotManager } from "@/domains/potential/potManager";
import DisplayContainer from "../../DisplayContainer";
import EquipFooter from "../EquipFooter";
import { useEquipmentCubeSessionContext } from "@/contexts/useEquipmentCubeSessionContext";

export default function CombineCubeWorkflow() {
  const {
    cube,
    working,
    pendingRoll,
    rollCombine,
    applyCombine,
    commitAndClose,
  } = useEquipmentCubeSessionContext();
  const [targetIndex, setTargetIndex] = useState(-1);
  const combineRoll = pendingRoll?.flow === "combine" ? pendingRoll : null;
  const { tier, potentialIds } = working[cube.apply];

  const toggleTargetIndex = (index: number) => {
    if (combineRoll) return;
    setTargetIndex((prev) => (prev === index ? -1 : index));
  };

  const handleRoll = () => {
    rollCombine(targetIndex);
  };

  const handleApply = () => {
    applyCombine(true);
  };

  const handleDiscard = () => {
    applyCombine(false);
  };

  return (
    <>
      <DisplayContainer>
        <RankBanner rank={tier} />
        {potentialIds.map((id, index) => {
          const isTarget = targetIndex === index;
          const isSelected = combineRoll?.selectedIndex === index;

          return (
            <div
              key={`${id}-${index}`}
              className={cn(
                "flex cursor-pointer flex-row items-center justify-between rounded p-1",
                (isTarget || isSelected) &&
                  "bg-accent-main text-accent-main-foreground",
                combineRoll && "cursor-default",
              )}
              onClick={() => toggleTargetIndex(index)}
            >
              <PotentialLineBadge
                text={
                  PotManager.resolvePotential(
                    id,
                    working.level,
                    working.subcategory,
                  ).display
                }
                rank={PotManager.getPotentialMetadata(id).rank}
                className="rounded p-1"
              />
              <Button
                size="icon-xs"
                variant="ghost"
                disabled={!!combineRoll}
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
        <CloseBtn disabled={!!combineRoll} onClose={commitAndClose} />
        <div className="flex flex-row gap-2">
          <Button variant="primary" onClick={handleRoll}>
            {combineRoll ? "Reroll" : "Roll"}
          </Button>
          {combineRoll && (
            <>
              <Button variant="secondary" onClick={handleDiscard}>
                Discard
              </Button>
              <Button variant="primary" onClick={handleApply}>
                Apply
              </Button>
            </>
          )}
        </div>
      </EquipFooter>
    </>
  );
}
