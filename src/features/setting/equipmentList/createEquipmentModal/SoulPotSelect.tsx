import { useCreateEquipmentContext } from "@/contexts/useCreateEquipmentContext";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import { SOUL_POTENTIAL_SOURCE } from "@/domains/enhancement/soul/soul.data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const NONE_VALUE = "none";

export default function SoulPotSelect() {
  const { equipmentData, updateSoul } = useCreateEquipmentContext();
  const { level } = equipmentData;

  const selectRank = (id: string) => {
    updateSoul(id === NONE_VALUE ? null : id);
  };

  return (
    <FieldGroup>
      <Field orientation="vertical" className="min-w-0">
        <FieldContent>
          <FieldLabel className="font-bold">靈魂寶珠潛能</FieldLabel>
        </FieldContent>
        <Select onValueChange={selectRank} value={equipmentData.soul || ""}>
          <SelectTrigger>
            <SelectValue placeholder="請選擇寶珠潛能" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE} className="text-muted-foreground">
              請選擇寶珠潛能
            </SelectItem>
            {SOUL_POTENTIAL_SOURCE.map(({ id }) => (
              <SelectItem key={id} value={id}>
                {SoulManager.getLine(id, level)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
