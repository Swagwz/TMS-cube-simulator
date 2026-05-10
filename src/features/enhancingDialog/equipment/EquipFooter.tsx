import React from "react";
import EnhancerFooter from "../EnhancerFooter";
import Counter from "../Counter";
import { useEnhancingContext } from "@/contexts/useEnhancingContext";
import { useOptionalEquipmentCubeSession } from "@/contexts/useEquipmentCubeSessionContext";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import { getCubeCompanionItems } from "@/domains/enhancement/cube/cube.registry";
import type {
  AdditionalCubeId,
  CubeId,
  MainCubeId,
} from "@/domains/enhancement/cube/cube.type";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";

type Props = {
  children: React.ReactNode;
};

export default function EquipFooter({ children }: Props) {
  const { localData, selectedItemId } = useEnhancingContext();
  const cubeSession = useOptionalEquipmentCubeSession();

  if (selectedItemId === "wuGongJewel") {
    const item = SoulManager.getItem(selectedItemId);
    return (
      <EnhancerFooter
        counter={
          <Counter
            items={[
              {
                id: item.id,
                name: item.name,
                imagePath: item.imagePath,
                count: localData.statistics.counts.soul[item.id] || 0,
              },
            ]}
          />
        }
      >
        {children}
      </EnhancerFooter>
    );
  }

  const cube = cubeSession?.cube ?? CubeManager.getCubeItem(selectedItemId as CubeId);
  const working = cubeSession?.working ?? localData;
  const count =
    cube.apply === "mainPot"
      ? working.statistics.counts.mainPot[cube.id as MainCubeId]
      : working.statistics.counts.additionalPot[cube.id as AdditionalCubeId];
  const items = [
    {
      id: cube.id,
      name: cube.name,
      imagePath: cube.imagePath,
      count: count || 0,
    },
    ...getCubeCompanionItems(cube.id).map((item) => ({
      id: item.id,
      name: item.name,
      imagePath: item.imagePath,
      count: working.statistics.counts.mainPot[item.id] || 0,
    })),
  ];

  return (
    <EnhancerFooter counter={<Counter items={items} />}>
      {children}
    </EnhancerFooter>
  );
}
