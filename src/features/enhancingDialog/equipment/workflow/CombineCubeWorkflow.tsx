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
import { useRequiredCubeEnhancementController } from "@/contexts/useEquipmentEnhancementSessionContext";

export default function CombineCubeWorkflow() {
  const {
    cube,
    working,
    pendingRoll,
    rollCombine,
    applyCombine,
    commitAndClose,
  } = useRequiredCubeEnhancementController();
  const [targetIndex, setTargetIndex] = useState(-1);
  const combineRoll = pendingRoll?.flow === "combine" ? pendingRoll : null;
  const { tier, potentialIds } = working[cube.apply];

  const toggleTargetIndex = (index: number) => {
    setTargetIndex((prev) => (prev === index ? -1 : index));
  };

  const handleRoll = () => {
    rollCombine(targetIndex);
  };

  const handleApply = () => {
    applyCombine(true);
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
                "flex cursor-pointer flex-row items-center justify-between rounded border border-transparent p-1 transition-colors",
                isSelected && "bg-accent-main text-accent-main-foreground",
                isTarget &&
                  !isSelected &&
                  "border-destructive bg-destructive/10 text-destructive",
                isTarget &&
                  isSelected &&
                  "ring-destructive ring-offset-background ring-2 ring-offset-2",
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
                className={cn(
                  "text-muted-foreground hover:bg-accent-dark hover:text-accent-dark-foreground",
                  isTarget &&
                    "bg-destructive text-white hover:bg-destructive/90 hover:text-white",
                )}
              >
                <Crosshair />
              </Button>
            </div>
          );
        })}
      </DisplayContainer>

      <EquipFooter>
        <CloseBtn onClose={commitAndClose} />
        <div className="flex flex-row gap-2">
          <Button variant="primary" onClick={handleRoll}>
            {combineRoll ? "Reroll" : "Roll"}
          </Button>
          {combineRoll && (
            <Button variant="primary" onClick={handleApply}>
              Apply
            </Button>
          )}
        </div>
      </EquipFooter>
    </>
  );
}
