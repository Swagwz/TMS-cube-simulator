import React from "react";
import { produce } from "immer";
import { Trash } from "lucide-react";
import type { EquipmentAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  EquipmentRank,
  StatusField,
} from "@/domains/potential/potential.type";
import { POTENTIAL_RANK_LIST } from "@/domains/potential/potential.config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProbabilityDisplay } from "@/components/ProbabilityDisplay";
import { PotentialAutoRoll } from "@/domains/autoRoll/equipAutoRollManager";
import { useEnhancingContext } from "@/contexts/useEnhancingContext";
import { EnhancementManager } from "@/domains/enhancement/enhancementManager";
import type { PotentialFeature } from "@/domains/equipment/equipment.type";
import { PotManager } from "@/domains/potential/potManager";

type Props = {
  targets: EquipmentAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<EquipmentAutoRollTarget[]>>;
};

export default function EquipTargetSetting({ targets, setTargets }: Props) {
  const { localData, selectedEhmId } = useEnhancingContext();
  const { subcategory, level } = localData;
  const feature = EnhancementManager.getItem(selectedEhmId)
    .apply as PotentialFeature;
  const tier = localData[feature].tier;

  return (
    <Accordion
      type="multiple"
      className="flex flex-col gap-2"
      defaultValue={targets.map((_, i) => `item-${i}`)}
    >
      {targets.map((targetSet, groupIndex) => {
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
        // const prob = PotentialAutoRoll.calcProb(
        //   subcategory,
        //   level,
        //   calculationTier,
        //   selectedEhmId as CubeId,
        //   targetSet,
        //   [],
        // );
        const prob = 0;
        return (
          <AccordionItem
            key={groupIndex}
            value={`item-${groupIndex}`}
            className="bg-glass-light/50 data-[state=open]:bg-glass-light/70 rounded-md border-none px-2"
          >
            <AccordionTrigger className="[&>svg]:text-glass-foreground py-2 hover:no-underline">
              <div className="mr-2 flex flex-1 items-center justify-between">
                <div className="text-glass-foreground flex items-center gap-2 text-sm font-medium hover:text-white">
                  <span>組合 {groupIndex + 1}</span>
                  <ProbabilityDisplay prob={prob} />
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="hover:text-destructive text-glass-foreground h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTargets(
                      produce((draft) => {
                        draft.splice(groupIndex, 1);
                      }),
                    );
                  }}
                >
                  <span role="button">
                    <Trash className="h-3 w-3" />
                  </span>
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
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
                      {POTENTIAL_RANK_LIST.filter(
                        (r) => r.rank !== "normal",
                      ).map((r) => (
                        <SelectItem key={r.rank} value={r.rank}>
                          {r.name}
                        </SelectItem>
                      ))}
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
                    <Input
                      value={
                        targetSet.stats[slotIndex].value === 0
                          ? ""
                          : targetSet.stats[slotIndex].value
                      }
                      type="number"
                      inputMode="numeric"
                      className="w-20 text-center"
                      onFocus={(e) => e.target.select()}
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
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
