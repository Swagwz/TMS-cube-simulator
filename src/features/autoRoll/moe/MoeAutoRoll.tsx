import React from "react";
import MoeTargetSetting from "./MoeTargetSetting";
import type { MoeAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";
import { Button } from "@/components/ui/button";
import { produce } from "immer";
import { Plus } from "lucide-react";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";

type Props = {
  targets: MoeAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<MoeAutoRollTarget[]>>;
  variant?: React.ComponentProps<typeof MoeTargetSetting>["variant"];
  subcategory: MoeCardSubcategory;
  cubeId: MoeCubeId;
};

const NEW_TARGET_ITEM: MoeAutoRollTarget = {
  stats: [
    { field: null, value: 0 },
    { field: null, value: 0 },
    { field: null, value: 0 },
  ],
};

export default function MoeAutoRoll({
  targets,
  setTargets,
  variant = "glass",
  subcategory,
  cubeId,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <MoeTargetSetting
        targets={targets}
        setTargets={setTargets}
        variant={variant}
        subcategory={subcategory}
        cubeId={cubeId}
      />
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
