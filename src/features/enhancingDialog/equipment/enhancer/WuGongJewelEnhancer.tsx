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
          <p className="text-center">
            {"\u76ee\u524d\u6c92\u6709\u6b66\u529f\u5bf6\u73e0"}
          </p>
        )}
      </DisplayContainer>
      <EquipFooter>
        <CloseBtn onClose={commitAndClose} />
        <Button variant="primary" onClick={rollSoulAndApply}>
          {"\u91cd\u65b0\u6d17\u934a"}
        </Button>
      </EquipFooter>
    </>
  );
}
