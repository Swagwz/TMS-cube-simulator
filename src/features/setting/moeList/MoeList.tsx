import { useMoeStore } from "@/store/useMoeStore";
import MoeTable from "./MoeTable";
import EmptyList from "../EmptyList";

export default function MoeList() {
  const isEmpty = useMoeStore((s) => s.instanceIds.length === 0);
  if (isEmpty) return <EmptyList type="moe" />;
  return <MoeTable />;
}
