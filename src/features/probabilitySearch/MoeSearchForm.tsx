import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOE_CARD_LIST } from "@/domains/moeCard/moeCard.config";
import { MOE_CUBE_LIST } from "@/domains/enhancement/moe/moe.config";
import FormField from "@/components/FormField";
import MoeCardTypeSelect from "@/components/form/MoeCardTypeSelect";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import MoePotentialProbResult from "./MoePotentialProbResult";

const MOE_CUBES = MOE_CUBE_LIST.map((item) => ({
  label: item.name,
  value: item.id,
}));

export default function MoeSearchForm() {
  const [moeSub, setMoeSub] = useState<MoeCardSubcategory>(
    MOE_CARD_LIST[0].subcategory,
  );
  const [moeCube, setMoeCube] = useState<MoeCubeId>(MOE_CUBES[0].value);

  const handleCardSelect = (val: string) => {
    setMoeSub(val as MoeCardSubcategory);
  };

  const handleCubeSelect = (val: string) => {
    setMoeCube(val as MoeCubeId);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField label="萌獸種類">
        <MoeCardTypeSelect value={moeSub} onValueChange={handleCardSelect} />
      </FormField>

      <FormField label="方塊">
        <Select value={moeCube} onValueChange={handleCubeSelect}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MOE_CUBES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <MoePotentialProbResult subcategory={moeSub} cube={moeCube} />
    </div>
  );
}
