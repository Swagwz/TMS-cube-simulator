import DisplayField from "@/components/ui/DisplayField";
import MoePotentialDisplay from "./MoePotentialDisplay";
import useActiveItem from "@/hooks/useActiveItem";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";
import Statistics from "../Statistics";

export default function MoeDetail() {
  const instanceData = useActiveItem();

  if (!instanceData || instanceData.entity !== "moe") {
    return null;
  }

  const subcategoryName = MoeManager.getCardMetadata(
    instanceData.subcategory,
  ).name;

  return (
    <div className="flex w-full flex-col gap-4">
      <DisplayField label="萌獸種類">{subcategoryName}</DisplayField>
      <MoePotentialDisplay />

      <Statistics statistics={instanceData.statistics} />
    </div>
  );
}
