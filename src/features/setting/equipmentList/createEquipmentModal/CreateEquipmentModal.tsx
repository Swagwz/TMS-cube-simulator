import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import {
  MultiStepDialog,
  MultiStepDialogContent,
  MultiStepDialogFooter,
  MultiStepDialogHeader,
  MultiStepDialogStep,
  MultiStepDialogSteps,
  MultiStepDialogTrigger,
} from "@/components/MultiStepDialog";
import { useCreateEquipmentContext } from "@/contexts/useCreateEquipmentContext";
import { useEquipmentStore } from "@/store/useEquipmentStore";
import SetupEquipBasicInfo from "./basicInfoSetup/BasicInfoSetup";
import PotSelectGroup from "./potSelectGroup/PotSelectGroup";
import SoulPotSelect from "./SoulPotSelect";
import { EquipManager } from "@/domains/equipment/equipManager";

const BASE_STAGES = [
  { view: <SetupEquipBasicInfo />, id: "basic" },
  { view: <PotSelectGroup feature="mainPot" />, id: "mainPot" },
  {
    view: <PotSelectGroup feature="additionalPot" />,
    id: "addiPot",
  },
];

export default function CreateEquipmentModal() {
  const [open, setOpen] = useState(false);
  const { addEquipment, newInstance } = useEquipmentStore();
  const { equipmentData, resetData, randomPotIds } =
    useCreateEquipmentContext();

  const stages = useMemo(() => {
    const rst = [...BASE_STAGES];

    if (EquipManager.canApply(equipmentData.subcategory, "soul")) {
      rst.push({ view: <SoulPotSelect />, id: "soulPot" });
    }

    return rst;
  }, [equipmentData.subcategory]);

  const handleNext = (currentStep: number) => {
    const currStepIndex = currentStep - 1;
    const currStage = stages[currStepIndex];
    if (currStage.id === "basic") {
      randomPotIds("mainPot");
      randomPotIds("additionalPot");
    }
  };

  const handleFinish = () => {
    const inst = newInstance(equipmentData);
    addEquipment(inst);
    setOpen(false);
  };

  const toggleOpen = (isOpen: boolean) => {
    if (isOpen) resetData();
    setOpen(isOpen);
  };

  return (
    <MultiStepDialog open={open} onOpenChange={toggleOpen}>
      <MultiStepDialogTrigger asChild>
        <Button variant={"primary"} size={"sm"}>
          <PlusIcon />
          新增裝備
        </Button>
      </MultiStepDialogTrigger>

      <MultiStepDialogContent>
        <MultiStepDialogHeader>
          <DialogTitle className="text-xl font-bold">新增裝備</DialogTitle>
        </MultiStepDialogHeader>

        <MultiStepDialogSteps>
          {stages.map(({ view, id }) => (
            <MultiStepDialogStep key={id}>{view}</MultiStepDialogStep>
          ))}
        </MultiStepDialogSteps>

        <MultiStepDialogFooter onFinish={handleFinish} onNext={handleNext} />
      </MultiStepDialogContent>
    </MultiStepDialog>
  );
}
