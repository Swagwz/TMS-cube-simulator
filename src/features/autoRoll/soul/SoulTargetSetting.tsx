import React from "react";
import { produce } from "immer";
import type { SoulAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StatusField } from "@/domains/potential/potential.type";
import { SoulAutoRoll } from "@/domains/autoRoll/soulAutoRollManager";
import NumberInput from "@/components/form/NumberInput";
import TargetAccordion from "../TargetAccordion";

type Props = {
  targets: SoulAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<SoulAutoRollTarget[]>>;
  level: number;
  variant?: React.ComponentProps<typeof TargetAccordion>["variant"];
};

export default function SoulTargetSetting({
  targets,
  setTargets,
  level,
  variant = "glass",
}: Props) {
  const options = SoulAutoRoll.getOptions();

  return (
    <TargetAccordion
      variant={variant}
      targets={targets}
      onDelete={(index) =>
        setTargets(
          produce((draft) => {
            draft.splice(index, 1);
          }),
        )
      }
      getProb={(target) => SoulAutoRoll.calcProb(target, level)}
    >
      {(targetSet, groupIndex) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Select
              value={targetSet.stats[0]?.field ?? "any"}
              onValueChange={(val) =>
                setTargets(
                  produce((draft) => {
                    if (val === "any") {
                      draft[groupIndex].stats[0].value = 0;
                      draft[groupIndex].stats[0].field = null;
                    } else {
                      draft[groupIndex].stats[0].field = val as StatusField;
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
              value={
                targetSet.stats[0].value === 0 ? "" : targetSet.stats[0].value
              }
              className="w-20"
              onChange={(e) =>
                setTargets(
                  produce((draft) => {
                    let parsedNum = parseInt(e.target.value);
                    parsedNum = isNaN(parsedNum) ? 0 : parsedNum;
                    draft[groupIndex].stats[0].value =
                      Math.max(0, parsedNum) || 0;
                  }),
                )
              }
              required
            />
          </div>
        </div>
      )}
    </TargetAccordion>
  );
}
