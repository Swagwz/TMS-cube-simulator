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

export default function EqualCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("mainPot");
  const { level, mainPot, subcategory } = localData;

  const handleRoll = () => {
    const nextRank = CubeManager.rollRankUp("equalCube", mainPot.tier);
    const pots = CubeManager.rollPots("equalCube", nextRank, pools);
    setLocalData(
      produce((draft) => {
        draft!.mainPot.potIds = pots;
        draft!.mainPot.tier = nextRank;
        draft!.statistics.counts.equalCube =
          (draft?.statistics.counts.equalCube || 0) + 1;
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
