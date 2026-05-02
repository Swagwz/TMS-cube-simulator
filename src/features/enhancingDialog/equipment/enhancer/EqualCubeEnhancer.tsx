import { cn } from "@/lib/utils";

import { PotManager } from "@/domains/potential/potManager";

import RankBanner from "@/components/potential/RankBanner";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";

import DisplayContainer from "../../DisplayContainer";
import CloseBtn from "@/components/CloseBtn";
import EquipFooter from "../EquipFooter";
import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";
import { useAccountStore } from "@/store/useAccountStore";

export default function EqualCubeEnhancer() {
  const { item, equip, snap, handleClose } = useEquipEnhancer("mainPot");
  const { level, subcategory } = snap;
  const { mainPot } = snap;

  const handleRoll = () => {
    item.roll(equip, { multiplier: useAccountStore.getState().rankUpMultiplier });
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
