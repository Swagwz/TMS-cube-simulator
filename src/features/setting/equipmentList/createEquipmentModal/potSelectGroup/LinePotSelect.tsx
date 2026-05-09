import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEquipmentContext } from "@/contexts/useCreateEquipmentContext";
import { EquipManager } from "@/domains/equipment/equipManager";
import type { EquipmentPotentialSlot } from "@/domains/equipment/equipment.type";
import { PotManager } from "@/domains/potential/potManager";
import type { PotentialRank } from "@/domains/potential/potential.type";

type Props = {
  index: number;
  feature: EquipmentPotentialSlot;
};

export default function LinePotSelect({ index, feature }: Props) {
  const { equipmentData, updatePot } = useCreateEquipmentContext();

  const currPotId = equipmentData[feature].potentialIds[index];
  const {
    level,
    subcategory,
    [feature]: { tier },
  } = equipmentData;

  const groupPotList = useMemo(() => {
    const prevTier = PotManager.getPrev(tier);

    const params = { subcategory, level, feature };

    const generateListItem = (rank: PotentialRank) => ({
      rank,
      name: PotManager.rankToZh(rank),
      potentialIds: EquipManager.getPotentialOptions({ ...params, rank }),
    });

    return [generateListItem(tier), generateListItem(prevTier)];
  }, [level, subcategory, tier, feature]);

  const selectPot = (value: string) => updatePot(feature, index, value);

  return (
    <div className="flex min-w-0 gap-2">
      <Select required onValueChange={selectPot} value={currPotId}>
        <SelectTrigger className="w-full min-w-0 shrink grow [&>span]:truncate">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {groupPotList.map(({ rank, name, potentialIds }) => (
            <SelectGroup key={rank}>
              <SelectLabel variant={rank}>{name}</SelectLabel>
              {potentialIds.map((id) => {
                const resolved = PotManager.resolvePotential(
                  id,
                  level,
                  subcategory,
                );
                const { limit } = resolved.meta;

                return (
                  <SelectItem
                    value={id}
                    key={id}
                    textValue={resolved.display}
                    description={
                      limit
                        ? `限制：${limit.key} 最多 ${limit.max} 條`
                        : undefined
                    }
                  >
                    {resolved.display}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
