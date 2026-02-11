import { RefreshCw } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import FormField from "@/components/FormField";

import LinePotSelect from "./LinePotSelect";
import { useCreateEquipmentContext } from "@/contexts/useCreateEquipmentContext";
import type { PotentialFeature } from "@/domains/equipment/equipment.type";

const CN_NUMBERS = ["一", "二", "三"];

type PotSelectGroupProps = {
  feature: PotentialFeature;
};

const TitleConfig = {
  mainPot: "一般潛能",
  additionalPot: "附加潛能",
};

export default function PotSelectGroup({ feature }: PotSelectGroupProps) {
  const { randomPotIds } = useCreateEquipmentContext();
  const handleRandomPot = () => randomPotIds(feature);

  return (
    <>
      <div className="mb-2 flex flex-row items-center gap-2 font-bold">
        <p>{TitleConfig[feature]}</p>
        <Button size="icon-sm" onClick={handleRandomPot} variant="ghost">
          <RefreshCw />
        </Button>
      </div>
      <FieldGroup>
        {CN_NUMBERS.map((cnNumber, index) => (
          <FormField
            key={cnNumber}
            label={`第${cnNumber}排`}
            orientation="vertical"
          >
            <LinePotSelect index={index} feature={feature} />
          </FormField>
        ))}
      </FieldGroup>
    </>
  );
}
