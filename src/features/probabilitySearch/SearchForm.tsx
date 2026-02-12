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
import SoulSearchForm from "./SoulSearchForm";

export default function SearchForm() {
  const [system, setSystem] = useState<"moe" | "equipment" | "soul">(
    "equipment",
  );

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
            <SelectItem value="equipment">裝備</SelectItem>
            <SelectItem value="moe">萌獸</SelectItem>
            <SelectItem value="soul">靈魂寶珠</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {system === "equipment" && <EquipmentSearchForm />}

      {system === "moe" && <MoeSearchForm />}

      {system === "soul" && <SoulSearchForm />}
      <CommonQuestions />
    </div>
  );
}
