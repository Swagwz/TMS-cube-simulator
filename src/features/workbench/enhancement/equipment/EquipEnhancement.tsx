import { useState, type JSX } from "react";
import { cn } from "@/lib/utils";

import useActiveItem from "@/hooks/useActiveItem";
import type { EquipmentFeature } from "@/domains/equipment/equipment.type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PotentialTab from "./tabs/PotentialTab";
import { EquipManager } from "@/domains/equipment/equipManager";

const TABS_CONFIG: {
  value: EquipmentFeature;
  label: string;
  content: JSX.Element | null;
}[] = [
  {
    value: "mainPot",
    label: "一般潛能",
    content: <PotentialTab feature="mainPot" />,
  },
  {
    value: "additionalPot",
    label: "附加潛能",
    content: <PotentialTab feature="additionalPot" />,
  },
  {
    value: "soul",
    label: "靈魂寶珠",
    content: <PotentialTab feature="soul" />,
  },
];

type Tab = EquipmentFeature;

export default function EquipEnhancement() {
  const [currentTab, setCurrentTab] = useState<Tab>(TABS_CONFIG[0].value);

  const instanceData = useActiveItem();

  if (!instanceData || instanceData.entity !== "equipment") {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={currentTab} onValueChange={(v) => setCurrentTab(v as Tab)}>
        <TabsList className="max-w-full justify-start overflow-auto rounded-none border-b bg-transparent p-0">
          {TABS_CONFIG.filter(({ value }) =>
            EquipManager.canApply(instanceData.subcategory, value),
          ).map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "text-glass-foreground h-full cursor-pointer rounded-b-none border-0 border-b-2 border-transparent bg-transparent",
                "data-[state=active]:border-primary-main data-[state=active]:bg-glass-light data-[state=active]:shadow-none",
                "hover:border-primary-dark hover:bg-glass-light/50 hover:shadow-none",
              )}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS_CONFIG.map(({ value, content }) => (
          <TabsContent key={value} value={value}>
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
