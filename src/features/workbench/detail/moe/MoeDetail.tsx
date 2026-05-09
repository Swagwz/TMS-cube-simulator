import DisplayField from "@/components/ui/DisplayField";
import MoePotentialDisplay from "./MoePotentialDisplay";
import useActiveItem from "@/hooks/useActiveItem";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";
import Statistics, { type StatisticsRow } from "../Statistics";
import { MOE_CUBE_LIST } from "@/domains/enhancement/moe/moe.config";

export default function MoeDetail() {
  const instanceData = useActiveItem();

  if (!instanceData || instanceData.entity !== "moe") {
    return null;
  }

  const subcategoryName = MoeManager.getCardMetadata(
    instanceData.subcategory,
  ).name;
  const statisticsRows: StatisticsRow[] = MOE_CUBE_LIST.flatMap((item) => {
    const count = instanceData.statistics.counts[item.id] || 0;
    return count
      ? [
          {
            id: item.id,
            display: item.name,
            count,
            price: item.price,
            discount: item.discount,
          },
        ]
      : [];
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <DisplayField label="萌獸種類">{subcategoryName}</DisplayField>
      <MoePotentialDisplay />

      <Statistics rows={statisticsRows} />
    </div>
  );
}
