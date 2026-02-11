import { produce } from "immer";
import { cn } from "@/lib/utils";

import { rollWeightedIndex } from "@/utils/rollWeightedIndex";
import { PotManager } from "@/domains/potential/potManager";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";

import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";

import DisplayContainer from "../../DisplayContainer";
import CloseBtn from "@/components/CloseBtn";
import EquipFooter from "../EquipFooter";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";

export default function MirrorCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("mainPot");
  const { level, mainPot, subcategory } = localData;

  const handleRoll = () => {
    const nextRank = CubeManager.rollRankUp("mirrorCube", mainPot.tier);
    const pots = CubeManager.rollPots("mirrorCube", nextRank, pools);
    const hasMirror = rollWeightedIndex([20, 80]) === 0;
    if (hasMirror) {
      pots[1] = pots[0];
    }
    setLocalData(
      produce((draft) => {
        draft!.mainPot.potIds = pots;
        draft!.mainPot.tier = nextRank;
        draft!.statistics.counts.mirrorCube =
          (draft?.statistics.counts.mirrorCube || 0) + 1;
      }),
    );
  };

  return (
    <>
      <DisplayContainer>
        {<RankBanner rank={mainPot.tier} />}
        {mainPot.potIds.map((id, i) => (
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
