import { useMemo } from "react";
import PotentialLineMarker from "@/components/potential/PotentialLineMarker";
import DisplayField from "@/components/ui/DisplayField";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";
import useActiveItem from "@/hooks/useActiveItem";

export default function MoePotentialDisplay() {
  const title = "萌獸潛能";
  const instanceData = useActiveItem();

  if (!instanceData || instanceData.entity !== "moe") {
    return null;
  }

  const { potIds } = instanceData;

  const lines = useMemo(() => {
    return potIds.map((id) => ({
      id,
      text: MoeManager.getLine(id),
    }));
  }, [potIds]);

  return (
    <div className="flex flex-col gap-2">
      <DisplayField label={<p>{title}</p>} />
      <ol className="ml-2 flex flex-col gap-2">
        {lines.map(({ id, text }, i) => (
          <PotentialLineMarker key={`${id}-${i}`}>{text}</PotentialLineMarker>
        ))}
      </ol>
    </div>
  );
}
