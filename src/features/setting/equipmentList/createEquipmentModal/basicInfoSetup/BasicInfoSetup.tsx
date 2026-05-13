import { FieldGroup } from "@/components/ui/field";

import EquipTypeSelect from "@/components/form/EquipTypeSelect";
import RankSelect from "./RankSelect";
import FormField from "@/components/FormField";
import EquipLevelInput from "./EquipLevelInput";
import { useCreateEquipmentContext } from "@/contexts/useCreateEquipmentContext";
import { getEquipmentFeatureLabel } from "@/domains/equipment/equipmentFeature.config";

export default function SetupEquipBasicInfo() {
  const { equipmentData, updateType } = useCreateEquipmentContext();

  return (
    <>
      <FieldGroup>
        <FormField label="裝備種類">
          <EquipTypeSelect
            value={equipmentData.subcategory}
            onValueChange={updateType}
          />
        </FormField>

        <FormField label="裝備等級">
          <EquipLevelInput />
        </FormField>

        <FormField label={`${getEquipmentFeatureLabel("mainPot")}等級`}>
          <RankSelect feature="mainPot" />
        </FormField>

        <FormField label={`${getEquipmentFeatureLabel("additionalPot")}等級`}>
          <RankSelect feature="additionalPot" />
        </FormField>
      </FieldGroup>
    </>
  );
}
