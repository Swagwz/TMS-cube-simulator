import DisplayField from "@/components/ui/DisplayField";
import useActiveItem from "@/hooks/useActiveItem";
import { EquipManager } from "@/domains/equipment/equipManager";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import EquipmentPotentialDisplay from "./EquipmentPotentialDisplay";
import Statistics from "../Statistics";

export default function EquipmentDetail() {
  const instanceData = useActiveItem();

  if (!instanceData || instanceData.entity !== "equipment") {
    return null;
  }

  const subcategoryName = EquipManager.getEquipmentMetadata(
    instanceData.subcategory,
  ).name;

  return (
    <div className="flex w-full flex-col gap-4">
      <DisplayField label="裝備種類">{subcategoryName}</DisplayField>
      <DisplayField label="裝備等級">{instanceData.level}</DisplayField>

      <EquipmentPotentialDisplay feature="mainPot" />

      <EquipmentPotentialDisplay feature="additionalPot" />

      {instanceData.soul && (
        <DisplayField label="武公寶珠" className="text-rank-unique">
          {SoulManager.getLine(instanceData.soul, instanceData.level)}
        </DisplayField>
      )}

      <Statistics statistics={instanceData.statistics} />
    </div>
  );
}
