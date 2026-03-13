import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const BUTTON_OPTIONS = [1, 2, 3] as const;

type Props = {
  value: number;
  onChange: (val: number) => void;
};

export default function MultiplierSelector({ value, onChange }: Props) {
  return (
    <ButtonGroup>
      {BUTTON_OPTIONS.map((val) => (
        <Button
          variant="outline"
          className={cn(
            "text-muted-foreground hover:text-foreground",
            val === value &&
              "bg-accent-main hover:bg-accent-dark text-accent-main-foreground hover:text-accent-main-foreground",
          )}
          onClick={() => onChange(val)}
          key={val}
        >
          x{val}
        </Button>
      ))}
    </ButtonGroup>
  );
}
