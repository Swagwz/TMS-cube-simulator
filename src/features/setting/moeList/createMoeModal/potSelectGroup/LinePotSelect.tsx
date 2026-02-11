import { produce } from "immer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateMoeContext } from "@/contexts/useCreateMoeContext";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";

type Props = {
  index: number;
  subcategory: MoeCardSubcategory;
};

export default function LinePotSelect({ index, subcategory }: Props) {
  const { moeData, setMoeData } = useCreateMoeContext();

  const selectPot = (id: string) => {
    setMoeData(
      produce((draft) => {
        draft.potIds[index] = id;
      }),
    );
  };

  return (
    <div className="flex min-w-0 gap-2">
      <Select required onValueChange={selectPot} value={moeData.potIds[index]}>
        <SelectTrigger className="w-full min-w-0 shrink grow [&>span]:truncate">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MoeManager.getPotentialPool(subcategory).map(({ id }) => (
            <SelectItem value={id} key={id}>
              {MoeManager.getLine(id)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
