import { cn } from "@/lib/utils";
import CloseBtn from "@/components/CloseBtn";
import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";
import { canApplyCubeAtTier } from "@/domains/enhancement/cube/cube.registry";
import { getShinyCeiling } from "@/domains/enhancement/cube/cubeRoll.feature";
import { PotManager } from "@/domains/potential/potManager";
import { useAccountStore } from "@/store/useAccountStore";
import DisplayContainer from "../../DisplayContainer";
import EquipFooter from "../EquipFooter";
import { useRequiredCubeEnhancementController } from "@/contexts/useEquipmentEnhancementSessionContext";

export default function DirectCubeWorkflow() {
  const { cube, working, rollDirectAndApply, commitAndClose } =
    useRequiredCubeEnhancementController();
  const { tier, potentialIds } = working[cube.apply];
  const canApply = canApplyCubeAtTier(cube, tier);
  const pityCount = useAccountStore((s) => s.shinyPity[tier]);
  const { ceiling, baseProb, probIncr } = getShinyCeiling(tier);
  const currentProb = (baseProb + pityCount * probIncr).toFixed(3);

  return (
    <>
      {cube.id === "shinyAdditionalCube" && tier !== "legendary" && (
        <div>
          <p>
            Count: {pityCount} / {ceiling}
          </p>
          <p>Rank-up: {`${currentProb}%`}</p>
          <p>Increase: {`${probIncr}%`}</p>
        </div>
      )}
      <DisplayContainer>
        <RankBanner rank={tier} />
        {potentialIds.map((id, i) => (
          <PotentialLineBadge
            key={`${id}-${i}`}
            text={
              PotManager.resolvePotential(
                id,
                working.level,
                working.subcategory,
              ).display
            }
            rank={PotManager.getPotentialMetadata(id).rank}
            className={cn("rounded p-1")}
          />
        ))}
      </DisplayContainer>

      <EquipFooter>
        <CloseBtn onClose={commitAndClose} />
        <Button
          variant="primary"
          disabled={!canApply}
          onClick={rollDirectAndApply}
        >
          Roll
        </Button>
      </EquipFooter>
    </>
  );
}
