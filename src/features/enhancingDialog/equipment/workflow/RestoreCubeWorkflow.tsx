import { useState } from "react";
import { Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import CloseBtn from "@/components/CloseBtn";
import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";
import type { EquipmentSubcategory } from "@/domains/equipment/equipment.type";
import { getCubeCompanionItems } from "@/domains/enhancement/cube/cube.registry";
import type { PotentialLines } from "@/domains/enhancement/cube/cubeSession.type";
import { PotManager } from "@/domains/potential/potManager";
import DisplayContainer from "../../DisplayContainer";
import EquipFooter from "../EquipFooter";
import { useRequiredCubeEnhancementController } from "@/contexts/useEquipmentEnhancementSessionContext";

export default function RestoreCubeWorkflow() {
  const {
    cube,
    working,
    pendingRoll,
    rollRestore,
    applyRestore,
    commitAndClose,
  } = useRequiredCubeEnhancementController();
  const [fixedIndex, setFixedIndex] = useState(-1);
  const restoreRoll = pendingRoll?.flow === "restore" ? pendingRoll : null;
  const before = restoreRoll?.before ?? working[cube.apply];
  const after = restoreRoll?.after ?? null;
  const canFixLine = getCubeCompanionItems(cube.id).some(
    (item) => item.id === "fixPotential",
  );
  const activeFixedIndex = canFixLine
    ? (restoreRoll?.fixedIndex ?? fixedIndex)
    : -1;
  const isRankUp = Boolean(after && after.tier !== before.tier);

  const toggleFixedIndex = (index: number) => {
    if (!canFixLine || restoreRoll) return;
    setFixedIndex((prev) => (prev === index ? -1 : index));
  };

  const handleRoll = () => {
    rollRestore(canFixLine ? fixedIndex : -1);
  };

  const handleApply = (side: "before" | "after") => {
    if (!restoreRoll) return;
    applyRestore(side);
  };

  return (
    <>
      <div>
        Before
        <DisplayContainer
          onClick={() => handleApply("before")}
          className={cn(
            restoreRoll && "hover:bg-glass/50 cursor-pointer transition-all",
          )}
        >
          <PotentialLinesDisplay
            lines={before}
            level={working.level}
            subcategory={working.subcategory}
            fixedIndex={activeFixedIndex}
            canFixLine={canFixLine}
            canToggleFixedLine={!restoreRoll}
            onToggleFixedLine={toggleFixedIndex}
          />
        </DisplayContainer>
      </div>
      <div>
        After
        <DisplayContainer
          onClick={() => handleApply("after")}
          className={cn(
            restoreRoll && "hover:bg-glass/50 cursor-pointer transition-all",
          )}
        >
          {after && (
            <PotentialLinesDisplay
              lines={after}
              level={working.level}
              subcategory={working.subcategory}
            />
          )}
        </DisplayContainer>
      </div>

      <EquipFooter>
        <CloseBtn disabled={!!restoreRoll} onClose={commitAndClose} />
        <Button variant="primary" disabled={isRankUp} onClick={handleRoll}>
          {after ? "Reroll" : "Roll"}
        </Button>
      </EquipFooter>
    </>
  );
}

type PotentialLinesDisplayProps = {
  lines: PotentialLines;
  level: number;
  subcategory: EquipmentSubcategory;
  fixedIndex?: number;
  canFixLine?: boolean;
  canToggleFixedLine?: boolean;
  onToggleFixedLine?: (index: number) => void;
};

function PotentialLinesDisplay({
  lines,
  level,
  subcategory,
  fixedIndex = -1,
  canFixLine = false,
  canToggleFixedLine = false,
  onToggleFixedLine,
}: PotentialLinesDisplayProps) {
  return (
    <>
      <RankBanner rank={lines.tier} />
      {lines.potentialIds.map((id, index) => {
        const isFixed = fixedIndex === index;

        if (!canFixLine) {
          return (
            <PotentialLineBadge
              key={`${id}-${index}`}
              text={PotManager.resolvePotential(id, level, subcategory).display}
              rank={PotManager.getPotentialMetadata(id).rank}
              className="rounded p-1"
            />
          );
        }

        return (
          <div
            key={`${id}-${index}`}
            className={cn(
              "flex cursor-pointer flex-row items-center justify-between rounded p-1",
              isFixed && "bg-accent-main",
              !canToggleFixedLine && "cursor-default",
            )}
            onClick={(event) => {
              if (!canToggleFixedLine) return;
              event.stopPropagation();
              onToggleFixedLine?.(index);
            }}
          >
            <PotentialLineBadge
              text={PotManager.resolvePotential(id, level, subcategory).display}
              rank={PotManager.getPotentialMetadata(id).rank}
            />
            <Button
              size="icon-xs"
              variant="ghost"
              disabled={!canToggleFixedLine}
              className={cn(
                "hover:bg-accent-dark hover:text-accent-dark-foreground",
                isFixed &&
                  "text-glass-foreground/50 hover:bg-accent-main hover:text-accent-main-foreground",
              )}
            >
              {isFixed ? <Lock /> : <LockOpen />}
            </Button>
          </div>
        );
      })}
    </>
  );
}
