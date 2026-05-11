import CloseBtn from "@/components/CloseBtn";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { Button } from "@/components/ui/button";
import { useRequiredSoulEnhancementController } from "@/contexts/useEquipmentEnhancementSessionContext";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import DisplayContainer from "../../DisplayContainer";
import EquipFooter from "../EquipFooter";

export default function WuGongJewelEnhancer() {
  const { working, rollSoulAndApply, commitAndClose } =
    useRequiredSoulEnhancementController();
  const { level, soul } = working;

  return (
    <>
      <DisplayContainer className="min-h-0">
        {soul ? (
          <PotentialLineBadge
            className="rounded p-1"
            text={SoulManager.getLine(soul, level)}
          />
        ) : (
          <p className="text-center">目前沒有武公寶珠</p>
        )}
      </DisplayContainer>
      <EquipFooter>
        <CloseBtn onClose={commitAndClose} />
        <Button variant="primary" onClick={rollSoulAndApply}>
          重新洗鍊
        </Button>
      </EquipFooter>
    </>
  );
}
