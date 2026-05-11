import { useState } from "react";
import { CollapsibleDetail } from "@/components/CollapsibleDetail";
import FormField from "@/components/FormField";
import NumberInput from "@/components/form/NumberInput";
import SoulTypeSelect from "@/components/form/SoulTypeSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SoulAutoRollTarget } from "@/domains/autoRoll/autoRoll.type";
import { EquipManager } from "@/domains/equipment/equipManager";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import type { SoulId } from "@/domains/enhancement/soul/soul.type";
import SoulProbCalc from "./SoulProbCalc";
import SoulProbTable from "./SoulProbTable";

type FormData = {
  type: SoulId;
  level: number;
};

export default function SoulSearchForm() {
  const [formData, setFormData] = useState<FormData>({
    type: SoulManager.getDefaultItemId(),
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
      <FormField label="\u5bf6\u73e0\u985e\u578b">
        <SoulTypeSelect
          value={formData.type}
          onValueChange={handleSoulTypeSelect}
        />
      </FormField>
      <FormField label="\u7b49\u7d1a">
        <NumberInput
          value={formData.level}
          onChange={handleLevelChange}
          required
        />
      </FormField>
      <div className="col-span-1 md:col-span-2">
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">
              {"\u6a5f\u7387\u8868"}
            </TabsTrigger>
            <TabsTrigger value="calc">
              {"\u6a5f\u7387\u8a08\u7b97"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="table">
            <CollapsibleDetail title="\u6240\u6709\u5bf6\u73e0\u6f5b\u80fd">
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
