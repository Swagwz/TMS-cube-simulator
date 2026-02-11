import { cn } from "@/lib/utils";
import type { SwitchProps } from "@radix-ui/react-switch";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

type LabelSwitchProps = SwitchProps & {
  direction?: "verticle" | "horizontal";
  id: string;
  label?: string;
};

export default function LabelSwitch({
  direction = "horizontal",
  id,
  label,
  className,
  ...props
}: LabelSwitchProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "horizontal" ? "flex-row items-center" : "flex-col",
      )}
    >
      <Switch id={id} {...props} className={cn("cursor-pointer", className)} />
      <Label htmlFor={id} className="cursor-pointer">
        {label}
      </Label>
    </div>
  );
}
