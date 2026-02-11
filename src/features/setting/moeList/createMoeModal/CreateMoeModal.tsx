import { useState } from "react";
import { Button } from "@/components/ui/button";
import { produce } from "immer";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMoeStore } from "@/store/useMoeStore";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import MoeCardTypeSelect from "@/components/form/MoeCardTypeSelect";
import { useCreateMoeContext } from "@/contexts/useCreateMoeContext";
import PotSelectGroup from "./potSelectGroup/PotSelectGroup";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";

export default function CreateMoeModal() {
  const [open, setOpen] = useState(false);
  const { moeData, resetData, setMoeData, createMoeData } =
    useCreateMoeContext();
  const addMoe = useMoeStore((s) => s.addMoe);
  const newInstance = useMoeStore((s) => s.newInstance);

  const handleComplete = () => {
    const inst = newInstance(moeData);
    addMoe(inst);
    setOpen(false);
  };

  const toggleOpen = (isOpen: boolean) => {
    if (isOpen) resetData();
    setOpen(isOpen);
  };

  const handleTypeChange = (value: string) => {
    setMoeData(
      produce((draft) => {
        const { subcategory, potIds } = createMoeData(
          value as MoeCardSubcategory,
        );
        draft.subcategory = subcategory;
        draft.potIds = potIds;
      }),
    );
  };

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        <Button variant={"primary"} size={"sm"}>
          <PlusIcon />
          新增萌獸
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">新增萌獸</DialogTitle>
        </DialogHeader>

        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel className="font-bold">萌獸種類</FieldLabel>
          </FieldContent>
          <MoeCardTypeSelect
            value={moeData.subcategory}
            onValueChange={handleTypeChange}
          />
        </Field>

        <PotSelectGroup />

        <DialogFooter>
          <Button onClick={handleComplete} variant={"secondary"}>
            Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
