import React from "react";
import { produce } from "immer";
import type { EquipmentAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EquipmentRank,
  StatusField,
} from "@/domains/potential/potential.type";
import { POTENTIAL_RANK_LIST } from "@/domains/potential/potential.config";
import { PotentialAutoRoll } from "@/domains/autoRoll/equipAutoRollManager";
import { useEnhancingContext } from "@/contexts/useEnhancingContext";
import { EnhancementManager } from "@/domains/enhancement/enhancementManager";
import type { PotentialFeature } from "@/domains/equipment/equipment.type";
import { PotManager } from "@/domains/potential/potManager";
import NumberInput from "@/components/form/NumberInput";
import TargetAccordion from "../TargetAccordion";

type Props = {
  targets: EquipmentAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<EquipmentAutoRollTarget[]>>;
  variant?: React.ComponentProps<typeof TargetAccordion>["variant"];
};

export default function EquipTargetSetting({
  targets,
  setTargets,
  variant = "glass",
}: Props) {
  const { localData, selectedEhmId } = useEnhancingContext();
  const { subcategory, level } = localData;
  const feature = EnhancementManager.getItem(selectedEhmId)
    .apply as PotentialFeature;
  const tier = localData[feature].tier;

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
      getProb={() => 0}
    >
      {(targetSet, groupIndex) => {
        const currentIdx = PotManager.getIndex(tier);
        const targetIdx = targetSet.rank
          ? PotManager.getIndex(targetSet.rank)
          : -1;
        const calculationTier =
          targetSet.rank && targetIdx > currentIdx ? targetSet.rank : tier;
        const options = PotentialAutoRoll.getOptions(
          subcategory,
          level,
          feature,
          calculationTier,
        );
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-glass-foreground w-16 shrink-0 text-xs font-medium">
                目標階級
              </span>
              <Select
                value={targetSet.rank ?? "any"}
                onValueChange={(val) =>
                  setTargets(
                    produce((draft) => {
                      draft[groupIndex].rank =
                        val === "any" ? null : (val as EquipmentRank);
                    }),
                  )
                }
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue placeholder="不限階級" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">不限階級</SelectItem>
                  {POTENTIAL_RANK_LIST.filter((r) => r.rank !== "normal").map(
                    (r) => (
                      <SelectItem key={r.rank} value={r.rank}>
                        {r.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
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
        );
      }}
    </TargetAccordion>
  );
}
