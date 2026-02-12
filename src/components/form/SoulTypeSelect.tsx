import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SOUL_LIST } from "@/domains/enhancement/soul/soul.config";

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
        {SOUL_LIST.map(({ name, id }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
