import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EquipManager } from "@/domains/equipment/equipManager";
import { getEquipmentFeatureLabel } from "@/domains/equipment/equipmentFeature.config";
import type {
  EquipmentEnhancementItemId,
  EquipmentFeature,
} from "@/domains/equipment/equipment.type";
import EquipEnhancingDialog from "@/features/enhancingDialog/equipment/EquipEnhancingDialog";
import useActiveItem from "@/hooks/useActiveItem";
import { useEquipmentEnhancingDialog } from "@/hooks/useEquipmentEnhancingDialog";
import { cn } from "@/lib/utils";
import type { EquipmentInstance } from "@/store/useEquipmentStore";
import PotentialTab from "./tabs/PotentialTab";

const TABS_CONFIG: {
  value: EquipmentFeature;
  label: string;
}[] = [
  {
    value: "mainPot",
    label: getEquipmentFeatureLabel("mainPot"),
  },
  {
    value: "additionalPot",
    label: getEquipmentFeatureLabel("additionalPot"),
  },
  {
    value: "soul",
    label: getEquipmentFeatureLabel("soul"),
  },
];

type Tab = EquipmentFeature;

export default function EquipEnhancement() {
  const [currentTab, setCurrentTab] = useState<Tab>(TABS_CONFIG[0].value);
  const { request, openDialog, closeDialog } = useEquipmentEnhancingDialog();
  const instanceData = useActiveItem();

  if (!instanceData || instanceData.entity !== "equipment") {
    return null;
  }

  const handleOpenDialog = (
    equipment: EquipmentInstance,
    itemId: EquipmentEnhancementItemId,
  ) => {
    openDialog(equipment, itemId);
  };

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
        {TABS_CONFIG.map(({ value }) => (
          <TabsContent key={value} value={value}>
            <PotentialTab feature={value} onOpenDialog={handleOpenDialog} />
          </TabsContent>
        ))}
      </Tabs>

      <EquipEnhancingDialog request={request} closeModal={closeDialog} />
    </div>
  );
}
