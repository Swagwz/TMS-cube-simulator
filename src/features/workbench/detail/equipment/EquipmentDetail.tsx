import DisplayField from "@/components/ui/DisplayField";
import useActiveItem from "@/hooks/useActiveItem";
import { EquipManager } from "@/domains/equipment/equipManager";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import EquipmentPotentialDisplay from "./EquipmentPotentialDisplay";
import Statistics, { type StatisticsRow } from "../Statistics";
import {
  CUBE_COMPANION_ITEMS,
  CUBE_LIST,
} from "@/domains/enhancement/cube/cube.config";
import { SOUL_LIST } from "@/domains/enhancement/soul/soul.config";
import type {
  AdditionalCubeId,
  MainCubeId,
} from "@/domains/enhancement/cube/cube.type";

export default function EquipmentDetail() {
  const instanceData = useActiveItem();

  if (!instanceData || instanceData.entity !== "equipment") {
    return null;
  }

  const subcategoryName = EquipManager.getEquipmentMetadata(
    instanceData.subcategory,
  ).name;
  const { counts } = instanceData.statistics;
  const statisticsRows: StatisticsRow[] = [
    ...CUBE_LIST.filter(({ apply }) => apply === "mainPot").flatMap((item) => {
      const count = counts.mainPot[item.id as MainCubeId] || 0;
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
    }),
    ...CUBE_COMPANION_ITEMS.flatMap((item) => {
      const count = counts.mainPot[item.id] || 0;
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
    }),
    ...CUBE_LIST.filter(({ apply }) => apply === "additionalPot").flatMap(
      (item) => {
        const count = counts.additionalPot[item.id as AdditionalCubeId] || 0;
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
      },
    ),
    ...SOUL_LIST.flatMap((item) => {
      const count = counts.soul[item.id] || 0;
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
    }),
  ];

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

      <Statistics rows={statisticsRows} />
    </div>
  );
}
