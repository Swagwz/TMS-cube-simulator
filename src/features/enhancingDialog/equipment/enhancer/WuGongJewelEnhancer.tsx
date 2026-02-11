import { produce } from "immer";

import { useEquipEnhancer } from "@/hooks/useEquipEnhancer";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";

import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";

import DisplayContainer from "../../DisplayContainer";
import CloseBtn from "@/components/CloseBtn";
import EquipFooter from "../EquipFooter";

export default function WuGongJewelEnhancer() {
  const { localData, setLocalData, pools, handleClose } =
    useEquipEnhancer("soul");
  const { level, soul } = localData;

  const handleRoll = () => {
    const rolledPot = SoulManager.rollPot(pools);

    setLocalData(
      produce((draft) => {
        draft!.soul = rolledPot;
        draft!.statistics.counts.wuGongJewel =
          (draft?.statistics.counts.wuGongJewel || 0) + 1;
      }),
    );
  };

  return (
    <>
      <DisplayContainer className="min-h-0">
        {soul ? (
          <PotentialLineBadge
            className="rounded p-1"
            text={SoulManager.getLine(soul, level)}
          />
        ) : (
          <p className="text-center">尚未設定</p>
        )}
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
