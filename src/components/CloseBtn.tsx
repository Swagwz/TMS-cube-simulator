import { Button } from "@/components/ui/button";

type Props = {
  disabled?: boolean;
  onClose: () => void;
};

export default function CloseBtn({ disabled = false, onClose }: Props) {
  return (
    <Button variant="secondary" onClick={onClose} disabled={disabled}>
      關閉
    </Button>
  );
}
