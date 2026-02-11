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
    // 還在選擇潛能時,不能改變固定潛能
    if (after) return;
    setLockIndex((prev) => (prev === index ? -1 : index));
  };

  // 抽離計算邏輯：傳入 "當前潛能" (Base)，回傳 "洗完的結果"
  const performRoll = (basePot: { tier: EquipmentRank; potIds: string[] }) => {
    const nextRank = CubeManager.rollRankUp("restoreCube", basePot.tier);
    const rolledPots = CubeManager.rollPots("restoreCube", nextRank, pools);

    if (lockIndex !== -1) {
      // 使用傳入的 basePot 來鎖定潛能，而不是依賴外部 state
      rolledPots.splice(lockIndex, 1, basePot.potIds[lockIndex]);
    }

    return { tier: nextRank, potIds: rolledPots };
  };

  const handleRoll = () => {
    // 第一次洗，Base 是目前的 mainPot
    const result = performRoll(mainPot);
    setAfter(result);

    // 增加方塊數
    setLocalData(
      produce((draft) => {
        draft!.statistics.counts.restoreCube =
          (draft?.statistics.counts.restoreCube || 0) + 1;
        if (lockIndex !== -1) {
          draft!.statistics.counts.fixPotential =
            (draft?.statistics.counts.fixPotential || 0) + 1;
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
            const isLocked = lockIndex === i; // 計算鎖定狀態
            return (
              <div
                key={`${id}-${i}`}
                className={cn(
                  "flex cursor-pointer flex-row items-center justify-between rounded p-1",
                  isLocked && "bg-accent-main",
                )}
                onClick={() => toggleLock(i)} // 保持原有的 onClick 邏輯
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
          {!after || after.potIds.length === 0 ? "開始" : "再一次"}
        </Button>
      </EquipFooter>
    </>
  );
}
