import { produce } from "immer";
import { cn } from "@/lib/utils";

import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import { PotManager } from "@/domains/potential/potManager";

import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";

import DisplayContainer from "../../DisplayContainer";
import CloseBtn from "@/components/CloseBtn";
import EquipFooter from "../EquipFooter";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";

export default function MasterCraftsmanCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("mainPot");
  const { level, mainPot, subcategory } = localData;

  const handleRoll = () => {
    const nextRank = CubeManager.rollRankUp(
      "masterCraftsmanCube",
      mainPot.tier,
    );
    const pots = CubeManager.rollPots("masterCraftsmanCube", nextRank, pools);
    setLocalData(
      produce((draft) => {
        draft!.mainPot.potIds = pots;
        draft!.mainPot.tier = nextRank;
        draft!.statistics.counts.masterCraftsmanCube =
          (draft?.statistics.counts.masterCraftsmanCube || 0) + 1;
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
