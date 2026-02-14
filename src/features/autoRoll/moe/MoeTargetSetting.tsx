import React, { useMemo } from "react";
import { produce } from "immer";
import type { MoeAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoeAutoRoll } from "@/domains/autoRoll/moeAutoRollManager";
import type { StatusField } from "@/domains/potential/potential.type";
import NumberInput from "@/components/form/NumberInput";
import TargetAccordion from "../TargetAccordion";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";

type Props = {
  targets: MoeAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<MoeAutoRollTarget[]>>;
  variant?: React.ComponentProps<typeof TargetAccordion>["variant"];
  subcategory: MoeCardSubcategory;
  cubeId: MoeCubeId;
};

export default function MoeTargetSetting({
  targets,
  setTargets,
  variant = "glass",
  subcategory,
  cubeId,
}: Props) {
  const options = useMemo(
    () => MoeAutoRoll.getOptions(subcategory),
    [subcategory],
  );

  const handleDelete = (index: number) => {
    setTargets(
      produce((draft) => {
        draft.splice(index, 1);
      }),
    );
  };

  return (
    <TargetAccordion
      variant={variant}
      targets={targets}
      onDelete={handleDelete}
      getProb={(target) => MoeAutoRoll.calcProb(subcategory, cubeId, target)}
    >
      {(targetSet, groupIndex) => (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((slotIndex) => (
            <div className="flex items-center gap-2" key={slotIndex}>
              <Select
                key={slotIndex}
                value={targetSet.stats[slotIndex]?.field ?? "any"}
                onValueChange={(val) =>
                  setTargets(
                    produce((draft) => {
                      draft[groupIndex].stats[slotIndex].field =
                        val === "any" ? null : (val as StatusField);
                      if (val === "any") {
                        draft[groupIndex].stats[slotIndex].value = 0;
                      }
                    }),
                  )
                }
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue placeholder="任意潛能" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">未設定</SelectItem>
                  {options.map((opt) => (
                    <SelectItem key={opt.field} value={opt.field}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <NumberInput
                className="w-20"
                value={
                  targetSet.stats[slotIndex].value === 0
                    ? ""
                    : targetSet.stats[slotIndex].value
                }
                onChange={(e) =>
                  setTargets(
                    produce((draft) => {
                      let parsedNum = parseInt(e.target.value);
                      parsedNum = isNaN(parsedNum) ? 0 : parsedNum;
                      draft[groupIndex].stats[slotIndex].value =
                        Math.max(0, parsedNum) || 0;
                    }),
                  )
                }
                required
              />
            </div>
          ))}
        </div>
      )}
    </TargetAccordion>
  );
}
