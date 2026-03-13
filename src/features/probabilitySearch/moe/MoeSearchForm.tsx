import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOE_CARD_LIST } from "@/domains/moeCard/moeCard.config";
import { MOE_CUBE_LIST } from "@/domains/enhancement/moe/moe.config";
import FormField from "@/components/FormField";
import MoeCardTypeSelect from "@/components/form/MoeCardTypeSelect";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import type { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import MoePotentialProbTable from "./MoePotentialProbTable";
import MoeProbCalc from "./MoeProbCalc";
import type { MoeAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";
import { CollapsibleDetail } from "@/components/CollapsibleDetail";

const MOE_CUBES = MOE_CUBE_LIST.map((item) => ({
  label: item.name,
  value: item.id,
}));

type FormData = {
  subcategory: MoeCardSubcategory;
  cube: MoeCubeId;
};

export default function MoeSearchForm() {
  const [formData, setFormData] = useState<FormData>({
    subcategory: MOE_CARD_LIST[0].subcategory,
    cube: MOE_CUBES[0].value,
  });
  const [targets, setTargets] = useState<MoeAutoRollTarget[]>([]);

  const handleCardSelect = (val: string) => {
    setFormData({ ...formData, subcategory: val as MoeCardSubcategory });
  };

  const handleCubeSelect = (val: string) => {
    setFormData({ ...formData, cube: val as MoeCubeId });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField label="萌獸種類">
        <MoeCardTypeSelect
          value={formData.subcategory}
          onValueChange={handleCardSelect}
        />
      </FormField>

      <FormField label="方塊">
        <Select value={formData.cube} onValueChange={handleCubeSelect}>
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
      <div className="col-span-1 md:col-span-2">
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">機率表</TabsTrigger>
            <TabsTrigger value="calc">機率計算</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <CollapsibleDetail title="各潛能出現機率">
              <MoePotentialProbTable
                subcategory={formData.subcategory}
                cube={formData.cube}
              />
            </CollapsibleDetail>
          </TabsContent>
          <TabsContent value="calc">
            <MoeProbCalc
              subcategory={formData.subcategory}
              cube={formData.cube}
              targets={targets}
              setTargets={setTargets}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
