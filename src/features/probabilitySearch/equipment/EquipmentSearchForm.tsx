import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import EQUIPMENT_LIST from "@/domains/equipment/equipment.config";
import { POTENTIAL_RANK_LIST } from "@/domains/potential/potential.config";
import { EquipManager } from "@/domains/equipment/equipManager";
import type { EquipmentSubcategory } from "@/domains/equipment/equipment.type";
import { CUBE_LIST } from "@/domains/enhancement/cube/cube.config";
import FormField from "@/components/FormField";
import EquipTypeSelect from "@/components/form/EquipTypeSelect";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import { CubeManager } from "@/domains/enhancement/cube/cubeManager";
import RankUpProb from "../RankUpProb";
import RankProbabilityTable from "./RankProbabilityTable";
import PotentialProbTable from "./PotentialProbTable";
import NumberInput from "@/components/form/NumberInput";
import { CollapsibleDetail } from "@/components/CollapsibleDetail";

const EQUIP_CUBES = CUBE_LIST.map((item) => ({
  label: item.name,
  value: item.id,
}));

export default function EquipmentSearchForm() {
  const [equipSub, setEquipSub] = useState<EquipmentSubcategory>(
    EQUIPMENT_LIST[0].subcategory,
  );
  const [level, setLevel] = useState(() => {
    const sub = EQUIPMENT_LIST[0].subcategory;
    return EquipManager.getLevelConfig(sub).defaultLevel;
  });
  const [isFixedLevel, setIsFixedLevel] = useState(() => {
    const sub = EQUIPMENT_LIST[0].subcategory;
    return sub ? !!EquipManager.getLevelConfig(sub).isFixed : false;
  });
  const [rank, setRank] = useState<EquipmentRank>("legendary");
  const [equipCube, setEquipCube] = useState<CubeId>(EQUIP_CUBES[0].value);
  const [selectedLine, setSelectedLine] = useState<number>(0);

  const handleSubcategorySelect = (val: string) => {
    setEquipSub(val as EquipmentSubcategory);
    try {
      const config = EquipManager.getLevelConfig(val as EquipmentSubcategory);
      setLevel(config.defaultLevel);
      setIsFixedLevel(!!config.isFixed);
    } catch (e) {
      // ignore
    }
    setSelectedLine(0);
  };

  const handleRankSelect = (val: string) => {
    setRank(val as EquipmentRank);
    setSelectedLine(0);
  };

  const handleCubeSelect = (val: string) => {
    setEquipCube(val as CubeId);
    setSelectedLine(0);
  };

  const lineRankArr = CubeManager.getItem(equipCube).lineRank[rank] || [];
  const selectedLineProbs = lineRankArr[selectedLine];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="裝備種類">
          <EquipTypeSelect
            value={equipSub}
            onValueChange={handleSubcategorySelect}
          />
        </FormField>

        <FormField label="裝備等級">
          <NumberInput
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            disabled={isFixedLevel}
            required
          />
        </FormField>

        <FormField label="套用階級">
          <Select value={rank} onValueChange={handleRankSelect}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POTENTIAL_RANK_LIST.filter((r) => r.rank !== "normal").map(
                (r) => (
                  <SelectItem key={r.rank} value={r.rank}>
                    {r.name}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="方塊">
          <Select value={equipCube} onValueChange={handleCubeSelect}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EQUIP_CUBES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <div className="flex flex-col gap-4">
        <CollapsibleDetail title="跳框機率">
          <RankUpProb cube={equipCube} rank={rank} />
        </CollapsibleDetail>
        <RankProbabilityTable
          cube={equipCube}
          rank={rank}
          selectedLine={selectedLine}
          onLineSelect={setSelectedLine}
        />
        {selectedLineProbs && (
          <PotentialProbTable
            {...{ cube: equipCube, rank, level, subcategory: equipSub }}
            lineProbabilities={selectedLineProbs}
          />
        )}
      </div>
    </>
  );
}
