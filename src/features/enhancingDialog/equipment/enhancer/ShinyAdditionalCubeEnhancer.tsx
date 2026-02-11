import { produce } from "immer";
import { cn } from "@/lib/utils";

import { useAccountStore } from "@/store/useAccountStore";
import { PotManager } from "@/domains/potential/potManager";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";

import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";

import DisplayContainer from "../../DisplayContainer";
import CloseBtn from "@/components/CloseBtn";
import EquipFooter from "../EquipFooter";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";

export default function ShinyAdditionalCubeEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("additionalPot");
  const { level, additionalPot, subcategory } = localData;

  const pityCount = useAccountStore((s) => s.shinyPity[additionalPot.tier]);
  const incrementPity = useAccountStore((s) => s.incrementShinyPity);
  const resetPity = useAccountStore((s) => s.resetShinyPity);
  const { ceiling, baseProb, probIncr } = CubeManager.getShinyCeiling(
    additionalPot.tier,
  );

  const handleRoll = () => {
    const nextRank = CubeManager.rollShinyRankUp(additionalPot.tier, pityCount);

    if (nextRank !== additionalPot.tier) {
      resetPity(additionalPot.tier);
    } else {
      incrementPity(additionalPot.tier);
    }

    const pots = CubeManager.rollPots("shinyAdditionalCube", nextRank, pools);
    setLocalData(
      produce((draft) => {
        draft!.additionalPot.potIds = pots;
        draft!.additionalPot.tier = nextRank;
        draft!.statistics.counts.shinyAdditionalCube =
          (draft?.statistics.counts.shinyAdditionalCube || 0) + 1;
      }),
    );
  };

  const currentProb = (baseProb + pityCount * probIncr).toFixed(3);

  return (
    <>
      {additionalPot.tier !== "legendary" && (
        <div>
          <p>
            使用次數: {pityCount} / {ceiling}
          </p>
          <p>跳框機率: {`${currentProb}%`}</p>
          <p>每次使用增加: {`${probIncr}%`}</p>
        </div>
      )}
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
