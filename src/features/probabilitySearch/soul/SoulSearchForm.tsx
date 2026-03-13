import { useState } from "react";

import SoulTypeSelect from "@/components/form/SoulTypeSelect";
import FormField from "@/components/FormField";
import type { SoulId } from "@/domains/enhancement/soul/soul.type";
import { EquipManager } from "@/domains/equipment/equipManager";
import SoulProbTable from "./SoulProbTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SoulProbCalc from "./SoulProbCalc";
import type { SoulAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";
import NumberInput from "@/components/form/NumberInput";
import { CollapsibleDetail } from "@/components/CollapsibleDetail";

type FormData = {
  type: SoulId;
  level: number;
};

export default function SoulSearchForm() {
  const [formData, setFormData] = useState<FormData>({
    type: "wuGongJewel",
    level: 250,
  });
  const [targets, setTargets] = useState<SoulAutoRollTarget[]>([]);

  const handleSoulTypeSelect = (val: string) => {
    setFormData({ ...formData, type: val as SoulId });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseInt(value) || 0;
    const level = Math.min(Math.max(parsed, 0), EquipManager.maxLevel);
    setFormData({ ...formData, level });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField label="寶珠種類">
        <SoulTypeSelect
          value={formData.type}
          onValueChange={handleSoulTypeSelect}
        />
      </FormField>
      <FormField label="等級">
        <NumberInput
          value={formData.level}
          onChange={handleLevelChange}
          required
        />
      </FormField>
      <div className="col-span-1 md:col-span-2">
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">機率表</TabsTrigger>
            <TabsTrigger value="calc">機率計算</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <CollapsibleDetail title="各潛能出現機率">
              <SoulProbTable level={formData.level} />
            </CollapsibleDetail>
          </TabsContent>
          <TabsContent value="calc">
            <SoulProbCalc
              level={formData.level}
              targets={targets}
              setTargets={setTargets}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
