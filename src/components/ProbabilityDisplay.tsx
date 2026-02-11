import { cn } from "@/lib/utils";

type Props = {
  prob: number;
};

export function ProbabilityDisplay({ prob }: Props) {
  let color = "text-red-700";
  if (prob > 0.1) {
    color = "text-green-700";
  } else if (prob >= 0.01) {
    color = "text-orange-700";
  }
  return <span className={cn(color)}>機率: {(prob * 100).toFixed(6)}%</span>;
}
