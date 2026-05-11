import {
  getCubeCompanionItem,
  getCubeDefinition,
  isCubeCompanionItemId,
} from "@/domains/enhancement/cube/cube.registry";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import type { EquipmentInstance } from "@/store/useEquipmentStore";
import type { StatisticsRow } from "../Statistics";

export function getEquipmentStatisticsRows(
  instance: EquipmentInstance,
): StatisticsRow[] {
  const { counts } = instance.statistics;

  const mainPotRows = Object.entries(counts.mainPot).flatMap(([id, count]) => {
    if (!count) return [];

    if (isCubeCompanionItemId(id)) {
      const item = getCubeCompanionItem(id);
      return [
        {
          id,
          display: item.name,
          count,
          price: item.price,
          discount: item.discount,
        },
      ];
    }

    const cube = getCubeDefinition(id as CubeId);
    return [
      {
        id,
        display: cube.name,
        count,
        price: cube.price,
        discount: cube.discount,
      },
    ];
  });

  const additionalPotRows = Object.entries(counts.additionalPot).flatMap(
    ([id, count]) => {
      if (!count) return [];

      const cube = getCubeDefinition(id as CubeId);
      return [
        {
          id,
          display: cube.name,
          count,
          price: cube.price,
          discount: cube.discount,
        },
      ];
    },
  );

  const soulRows = Object.entries(counts.soul).flatMap(([id, count]) => {
    if (!count) return [];

    const item = SoulManager.getItem(id);
    return [
      {
        id,
        display: item.name,
        count,
        price: item.price,
        discount: item.discount,
      },
    ];
  });

  return [...mainPotRows, ...additionalPotRows, ...soulRows];
}
