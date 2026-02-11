import React from "react";
import EquipTargetSetting from "./EquipTargetSetting";
import { Button } from "@/components/ui/button";
import { produce } from "immer";
import type { EquipmentAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";
import { Plus } from "lucide-react";

type Props = {
  targets: EquipmentAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<EquipmentAutoRollTarget[]>>;
};

const NEW_TARGET_ITEM: EquipmentAutoRollTarget = {
  rank: null,
  stats: [
    { field: null, value: 0 },
    { field: null, value: 0 },
    { field: null, value: 0 },
  ],
};

export default function EquipAutoRoll({ targets, setTargets }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <EquipTargetSetting targets={targets} setTargets={setTargets} />
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          setTargets(
            produce((draft) => {
              draft.push(structuredClone(NEW_TARGET_ITEM));
            }),
          )
        }
      >
        <Plus className="h-3 w-3" /> 新增組合
      </Button>
    </div>
  );
}
