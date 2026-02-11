import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEquipmentContext } from "@/contexts/useCreateEquipmentContext";
import type { PotentialFeature } from "@/domains/equipment/equipment.type";
import { POTENTIAL_RANK_LIST } from "@/domains/potential/potential.config";

type Props = {
  feature: PotentialFeature;
};

export default function RankSelect({ feature }: Props) {
  const { equipmentData, updateRank } = useCreateEquipmentContext();
  const rank = equipmentData[feature].tier;
  const handleRankChange = (value: string) => updateRank(feature, value);
  return (
    <Select required onValueChange={handleRankChange} value={rank}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {POTENTIAL_RANK_LIST.filter(({ rank }) => rank !== "normal").map(
          ({ name, rank }) => (
            <SelectItem key={rank} value={rank}>
              {name}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
}
