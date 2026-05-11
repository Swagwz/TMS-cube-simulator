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
          <FieldLabel className="font-bold">
            {"\u6b66\u529f\u5bf6\u73e0\u6f5b\u80fd"}
          </FieldLabel>
        </FieldContent>
        <Select onValueChange={selectRank} value={equipmentData.soul || ""}>
          <SelectTrigger>
            <SelectValue placeholder="\u8acb\u9078\u64c7\u5bf6\u73e0\u6f5b\u80fd" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE} className="text-muted-foreground">
              {"\u8acb\u9078\u64c7\u5bf6\u73e0\u6f5b\u80fd"}
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
