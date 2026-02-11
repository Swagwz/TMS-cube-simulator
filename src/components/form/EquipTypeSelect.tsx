import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EQUIPMENTS from "@/domains/equipment/equipment.config";

const groupedObj = Object.groupBy(EQUIPMENTS, ({ category }) => category);
const EquipmentTypeArr = Object.entries(groupedObj);

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function EquipTypeSelect({ value, onValueChange }: Props) {
  return (
    <Select required onValueChange={onValueChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="選擇裝備" />
      </SelectTrigger>
      <SelectContent>
        {EquipmentTypeArr.map(([type, groupedArr]) => (
          <SelectGroup key={type}>
            <SelectLabel>{type}</SelectLabel>
            {groupedArr?.map(({ name, subcategory }) => (
              <SelectItem key={subcategory} value={subcategory}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
