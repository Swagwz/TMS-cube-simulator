import React, { useMemo } from "react";
import { produce } from "immer";
import { Trash } from "lucide-react";
import type { MoeAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMoeEnhancingContext } from "@/contexts/useMoeEnhancingContext";
import { MoeAutoRoll } from "@/domains/autoRoll/moeAutoRollManager";
import type { StatusField } from "@/domains/potential/potential.type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProbabilityDisplay } from "@/components/ProbabilityDisplay";

type Props = {
  targets: MoeAutoRollTarget[];
  setTargets: React.Dispatch<React.SetStateAction<MoeAutoRollTarget[]>>;
};

export default function MoeTargetSetting({ targets, setTargets }: Props) {
  const { localData, selectedItemId } = useMoeEnhancingContext();
  const subcategory = localData.subcategory;

  const options = useMemo(
    () => MoeAutoRoll.getOptions(subcategory),
    [subcategory],
  );

  return (
    <Accordion
      type="multiple"
      className="flex flex-col gap-2"
      defaultValue={targets.map((_, i) => `item-${i}`)}
    >
      {targets.map((targetSet, groupIndex) => {
        const prob = MoeAutoRoll.calcProb(
          subcategory,
          selectedItemId,
          targets[groupIndex],
        );
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
