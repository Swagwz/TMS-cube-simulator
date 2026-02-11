import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOE_CARD_LIST } from "@/domains/moeCard/moeCard.config";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function MoeCardTypeSelect({ value, onValueChange }: Props) {
  return (
    <Select required onValueChange={onValueChange} value={value}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {MOE_CARD_LIST.map(({ name, subcategory }) => (
          <SelectItem key={subcategory} value={subcategory}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
