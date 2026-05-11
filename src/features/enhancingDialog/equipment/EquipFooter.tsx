import React from "react";
import EnhancerFooter from "../EnhancerFooter";
import Counter from "../Counter";
import { useEquipmentEnhancementNavigator } from "@/contexts/useEquipmentEnhancementSessionContext";
import { getCubeCompanionItems } from "@/domains/enhancement/cube/cube.registry";
import type {
  AdditionalCubeId,
  MainCubeId,
} from "@/domains/enhancement/cube/cube.type";

type Props = {
  children: React.ReactNode;
};

export default function EquipFooter({ children }: Props) {
  const navigator = useEquipmentEnhancementNavigator();

  if (!navigator) {
    throw new Error("EquipFooter requires an active enhancement navigator");
  }

  if (navigator.kind === "soul") {
    const { soul, working } = navigator.controller;
    return (
      <EnhancerFooter
        counter={
          <Counter
            items={[
              {
                id: soul.id,
                name: soul.name,
                imagePath: soul.imagePath,
                count: working.statistics.counts.soul[soul.id] || 0,
              },
            ]}
          />
        }
      >
        {children}
      </EnhancerFooter>
    );
  }

  const { cube, working } = navigator.controller;
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
