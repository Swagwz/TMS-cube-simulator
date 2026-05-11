import { useState } from "react";
import { cn } from "@/lib/utils";
import CloseBtn from "@/components/CloseBtn";
import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";
import { PotManager } from "@/domains/potential/potManager";
import DisplayContainer from "../../DisplayContainer";
import EquipFooter from "../EquipFooter";
import { useRequiredCubeEnhancementController } from "@/contexts/useEquipmentEnhancementSessionContext";

export default function HexaCubeWorkflow() {
  const { cube, working, pendingRoll, rollHexa, applyHexa, commitAndClose } =
    useRequiredCubeEnhancementController();
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const hexaRoll = pendingRoll?.flow === "hexa" ? pendingRoll : null;
  const current = working[cube.apply];
  const displayedPotentialIds =
    hexaRoll?.candidates.potentialIds ?? current.potentialIds;

  const toggleSelection = (index: number) => {
    if (!hexaRoll) return;

    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((selectedIndex) => selectedIndex !== index);
      }

      if (prev.length === 3) return prev;
      return [...prev, index];
    });
  };

  const handleRoll = () => {
    setSelectedIndices([]);
    rollHexa();
  };

  const handleConfirm = () => {
    if (selectedIndices.length !== 3) return;
    applyHexa(selectedIndices as [number, number, number]);
    setSelectedIndices([]);
  };

  return (
    <>
      <DisplayContainer className="min-h-76">
        <RankBanner rank={current.tier} />
        {displayedPotentialIds.map((id, index) => {
          const isSelected = selectedIndices.includes(index);
          return (
            <PotentialLineBadge
              key={`${id}-${index}`}
              text={
                PotManager.resolvePotential(
                  id,
                  working.level,
                  working.subcategory,
                ).display
              }
              rank={PotManager.getPotentialMetadata(id).rank}
              onClick={() => toggleSelection(index)}
              className={cn(
                "rounded p-1",
                hexaRoll && "cursor-pointer",
                isSelected && "bg-accent-main text-accent-main-foreground",
              )}
            />
          );
        })}
      </DisplayContainer>
      <EquipFooter>
        <CloseBtn disabled={!!hexaRoll} onClose={commitAndClose} />
        {selectedIndices.length === 3 ? (
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        ) : (
          <Button variant="primary" onClick={handleRoll}>
            {hexaRoll ? "Reroll" : "Roll"}
          </Button>
        )}
      </EquipFooter>
    </>
  );
}
