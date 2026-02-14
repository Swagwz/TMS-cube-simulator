import React from "react";
import { produce } from "immer";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SoulAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";
import SoulTargetSetting from "./SoulTargetSetting";

type Props = {
  targets: SoulAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<SoulAutoRollTarget[]>>;
  level: number;
  variant?: React.ComponentProps<typeof SoulTargetSetting>["variant"];
};

const NEW_TARGET_ITEM: SoulAutoRollTarget = {
  stats: [{ field: null, value: 0 }],
};

export default function SoulAutoRoll({
  targets,
  setTargets,
  level,
  variant = "glass",
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <SoulTargetSetting
        targets={targets}
        setTargets={setTargets}
        level={level}
        variant={variant}
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
