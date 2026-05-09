import { produce } from "immer";

import { PotManager } from "@/domains/potential/potManager";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";

import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";
import CloseBtn from "@/components/CloseBtn";

import DisplayContainer from "../../DisplayContainer";
import EquipFooter from "../EquipFooter";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";

export default function AbsAdditionalCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("additionalPot");
  const { level, additionalPot, subcategory } = localData;

  const handleRoll = () => {
    // Absolute cube always rolls legendary potential.
    const newPots = CubeManager.rollPots(
      "absAdditionalCube",
      "legendary",
      pools,
    );

    setLocalData(
      produce((draft) => {
        if (draft) {
          draft!.additionalPot.potentialIds = newPots;
          draft!.statistics.counts.additionalPot.absAdditionalCube =
            (draft?.statistics.counts.additionalPot.absAdditionalCube || 0) + 1;
        }
      }),
    );
  };

  // Absolute cube is only available for legendary potential.
  if (additionalPot.tier !== "legendary") return null;

  return (
    <>
      <DisplayContainer>
        {<RankBanner rank={additionalPot.tier} />}
        {additionalPot.potentialIds.map((id, i) => (
          <PotentialLineBadge
            key={`${id}-${i}`}
            text={PotManager.resolvePotential(id, level, subcategory).display}
            rank={PotManager.getPotentialMetadata(id).rank}
            className="rounded p-1"
          />
        ))}
      </DisplayContainer>
      <EquipFooter>
        <CloseBtn onClose={handleClose} />
        <Button variant="primary" onClick={handleRoll}>
          使用
        </Button>
      </EquipFooter>
    </>
  );
}
