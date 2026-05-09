import { useState } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";
import { Lock, LockOpen } from "lucide-react";

import { PotManager } from "@/domains/potential/potManager";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";

import { Button } from "@/components/ui/button";
import CloseBtn from "@/components/CloseBtn";
import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import EquipFooter from "../EquipFooter";
import DisplayContainer from "../../DisplayContainer";

export default function RestoreCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("mainPot");
  const { level, mainPot, subcategory } = localData;
  const [after, setAfter] = useState<{
    tier: EquipmentRank;
    potIds: string[];
  } | null>(null);
  const [lockIndex, setLockIndex] = useState(-1);

  const isRankUp = Boolean(after && after.tier !== mainPot.tier);

  const toggleLock = (index: number) => {
    // Do not change locked lines while comparing before/after results.
    if (after) return;
    setLockIndex((prev) => (prev === index ? -1 : index));
  };

  // Roll against the provided base potential so before/after state stays stable.
  const performRoll = (basePot: { tier: EquipmentRank; potIds: string[] }) => {
    const nextRank = CubeManager.rollRankUp("restoreCube", basePot.tier);

    let rolledPots: string[];
    do {
      rolledPots = CubeManager.rollPots("restoreCube", nextRank, pools);
      if (lockIndex !== -1) {
        // Preserve the locked line from the base potential.
        rolledPots.splice(lockIndex, 1, basePot.potIds[lockIndex]);
      }
    } while (!PotManager.validateLineRules(rolledPots));

    return { tier: nextRank, potIds: rolledPots };
  };

  const handleRoll = () => {
    const result = performRoll(mainPot);
    setAfter(result);

    // Count cube and companion item usage.
    setLocalData(
      produce((draft) => {
        draft!.statistics.counts.mainPot.restoreCube =
          (draft?.statistics.counts.mainPot.restoreCube || 0) + 1;
        if (lockIndex !== -1) {
          draft!.statistics.counts.mainPot.fixPotential =
            (draft?.statistics.counts.mainPot.fixPotential || 0) + 1;
        }
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
            draft!.mainPot = after!;
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
          <RankBanner rank={mainPot.tier} />
          {mainPot.potIds.map((id, i) => {
            const isLocked = lockIndex === i;
            return (
              <div
                key={`${id}-${i}`}
                className={cn(
                  "flex cursor-pointer flex-row items-center justify-between rounded p-1",
                  isLocked && "bg-accent-main",
                )}
                onClick={() => toggleLock(i)}
              >
                <PotentialLineBadge
                  text={
                    PotManager.resolvePotential(id, level, subcategory).display
                  }
                  rank={PotManager.getPotentialMetadata(id).rank}
                />
                <Button
                  size={"icon-xs"}
                  variant={"ghost"}
                  className={cn(
                    "hover:bg-accent-dark hover:text-accent-dark-foreground",
                    isLocked &&
                      "text-glass-foreground/50 hover:bg-accent-main hover:text-accent-main-foreground",
                  )}
                >
                  {isLocked ? <Lock /> : <LockOpen />}
                </Button>
              </div>
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
          {!after || after.potIds.length === 0 ? "Roll" : "Reroll"}
        </Button>
      </EquipFooter>
    </>
  );
}
