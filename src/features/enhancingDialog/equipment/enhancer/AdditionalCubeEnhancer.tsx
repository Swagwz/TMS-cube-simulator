import { produce } from "immer";
import { cn } from "@/lib/utils";

import { PotManager } from "@/domains/potential/potManager";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";

import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";

import CloseBtn from "@/components/CloseBtn";
import DisplayContainer from "../../DisplayContainer";
import EquipFooter from "../EquipFooter";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";

export default function AdditionalCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("additionalPot");
  const { level, additionalPot, subcategory } = localData;

  const handleRoll = () => {
    const currentTier = additionalPot.tier;
    const nextRank = CubeManager.rollRankUp("additionalCube", currentTier);
    const newPots = CubeManager.rollPots("additionalCube", nextRank, pools);

    setLocalData(
      produce((draft) => {
        if (draft) {
          draft.additionalPot.potIds = newPots;
          draft.additionalPot.tier = nextRank;
          draft.statistics.counts.additionalCube =
            (draft?.statistics.counts.additionalCube || 0) + 1;
        }
      }),
    );
  };

  return (
    <>
      <DisplayContainer>
        {<RankBanner rank={additionalPot.tier} />}
        {additionalPot.potIds.map((id, i) => (
          <PotentialLineBadge
            key={`${id}-${i}`}
            text={PotManager.resolvePotential(id, level, subcategory).display}
            rank={PotManager.getPotentialMetadata(id).rank}
            className={cn("rounded p-1")}
          />
        ))}
      </DisplayContainer>
      <EquipFooter>
        <CloseBtn onClose={handleClose} />
        <Button variant="primary" onClick={handleRoll}>
          開始
        </Button>
      </EquipFooter>
    </>
  );
}
