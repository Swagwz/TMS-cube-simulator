import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function SoulTypeSelect({ value, onValueChange }: Props) {
  return (
    <Select required onValueChange={onValueChange} value={value}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SoulManager.getItems().map(({ name, id }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
