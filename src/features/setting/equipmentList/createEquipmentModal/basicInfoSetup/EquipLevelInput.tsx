import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useCreateEquipmentContext } from "@/contexts/useCreateEquipmentContext";
import { EquipManager } from "@/domains/equipment/equipManager";
import NumberInput from "@/components/form/NumberInput";

export default function EquipLevelInput() {
  const { equipmentData, updateLevel } = useCreateEquipmentContext();

  const levelConfig = useMemo(
    () => EquipManager.getLevelConfig(equipmentData.subcategory),
    [equipmentData.subcategory],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsed = parseInt(value) || 0;
    const level = Math.min(Math.max(parsed, 0), EquipManager.maxLevel);
    updateLevel(level);
  };

  return (
    <div className="flex flex-col gap-2">
      <NumberInput
        value={equipmentData.level}
        onChange={handleChange}
        disabled={levelConfig.isFixed}
        required
      />
      <div className="flex flex-row justify-center gap-2">
        {!levelConfig.isFixed &&
          levelConfig.levels.map((lv) => (
            <Badge
              key={lv}
              onClick={() => updateLevel(lv)}
              className="cursor-pointer"
              variant="secondary"
            >
              {lv}
            </Badge>
          ))}
      </div>
    </div>
  );
}
