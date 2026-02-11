import { useMemo } from "react";
import PotentialLineMarker from "@/components/potential/PotentialLineMarker";
import RankBadge from "@/components/potential/RankBadge";
import DisplayField from "@/components/ui/DisplayField";
import type { PotentialFeature } from "@/domains/equipment/equipment.type";
import { PotManager } from "@/domains/potential/potManager";
import useActiveItem from "@/hooks/useActiveItem";

type Props = {
  feature: PotentialFeature;
};

export default function EquipmentPotentialDisplay({ feature }: Props) {
  const instanceData = useActiveItem();

  if (!instanceData || instanceData.entity !== "equipment") {
    return null;
  }

  const title = feature === "mainPot" ? "一般潛能" : "附加潛能";

  const {
    [feature]: { tier, potIds },
    level,
    subcategory,
  } = instanceData;

  const lines = useMemo(() => {
    return potIds.map((id) => ({
      id,
      text: PotManager.resolvePotential(id, level, subcategory).display,
      rank: PotManager.getPotentialMetadata(id).rank,
    }));
  }, [potIds]);

  return (
    <div className="flex flex-col gap-2">
      <DisplayField
        label={
          <p className="flex items-center gap-2">
            <RankBadge rank={tier} />
            {title}
          </p>
        }
      />
      <ol className="ml-2 flex flex-col gap-2">
        {lines.map(({ id, text, rank }, i) => (
          <PotentialLineMarker variant={rank} key={`${id}-${i}`}>
            {text}
          </PotentialLineMarker>
        ))}
      </ol>
    </div>
  );
}
