import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormField from "@/components/FormField";
import EquipmentSearchForm from "./EquipmentSearchForm";
import MoeSearchForm from "./MoeSearchForm";
import CommonQuestions from "./CommonQuestions";

export default function SearchForm() {
  const [system, setSystem] = useState<"moe" | "equipment">("equipment");

  return (
    <div className="bg-card text-card-foreground flex w-2xl max-w-full flex-col gap-6 rounded-xl border p-6 shadow-sm">
      <FormField label="系統">
        <Select
          value={system}
          onValueChange={(v: "moe" | "equipment") => setSystem(v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equipment">裝備 (Equipment)</SelectItem>
            <SelectItem value="moe">萌獸 (Moe)</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {system === "equipment" && <EquipmentSearchForm />}

      {system === "moe" && <MoeSearchForm />}
      <CommonQuestions />
    </div>
  );
}
