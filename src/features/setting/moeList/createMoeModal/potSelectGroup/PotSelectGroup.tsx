import { RefreshCw } from "lucide-react";
import { produce } from "immer";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";

import { useCreateMoeContext } from "@/contexts/useCreateMoeContext";
import LinePotSelect from "./LinePotSelect";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";

const CN_NUMBERS = ["一", "二", "三"];

export default function PotSelectGroup() {
  const { moeData, setMoeData } = useCreateMoeContext();
  const { subcategory } = moeData;

  const handleRandomPot = () => {
    setMoeData(
      produce((draft) => {
        draft.potIds = MoeManager.createRandomPotentials(subcategory);
      }),
    );
  };

  return (
    <>
      <div className="mb-2 flex flex-row items-center gap-2 font-bold">
        <p>萌獸潛能</p>
        <Button size="icon-sm" onClick={handleRandomPot} variant="ghost">
          <RefreshCw />
        </Button>
      </div>
      <FieldGroup>
        {CN_NUMBERS.map((cnNumber, index) => (
          <Field orientation="vertical" className="min-w-0" key={cnNumber}>
            <FieldContent>
              <FieldLabel className="font-bold">{`第${cnNumber}排`}</FieldLabel>
            </FieldContent>
            <LinePotSelect index={index} subcategory={subcategory} />
          </Field>
        ))}
      </FieldGroup>
    </>
  );
}
