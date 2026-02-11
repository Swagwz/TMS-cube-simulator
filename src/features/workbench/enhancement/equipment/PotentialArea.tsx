import { useMemo } from "react";
import type { EquipmentFeature } from "@/domains/equipment/equipment.type";
import useActiveItem from "@/hooks/useActiveItem";
import PotentialLineBadge from "@/components/potential/PotentialLineBadge";
import { PotManager } from "@/domains/potential/potManager";
import { SoulManager } from "@/domains/enhancement/soul/soulManager";
import RankBanner from "@/components/potential/RankBanner";

type Props = {
  feature: EquipmentFeature;
};

export default function PotentialArea({ feature }: Props) {
  const activeItem = useActiveItem();

  if (!activeItem || activeItem.entity !== "equipment") {
    return null;
  }

  const { level, soul, subcategory } = activeItem;

  const potBanner = useMemo(() => {
    switch (feature) {
      case "mainPot":
        return <RankBanner rank={activeItem.mainPot.tier} />;
      case "additionalPot":
        return <RankBanner rank={activeItem.additionalPot.tier} />;
      case "soul":
      default:
        return null;
    }
  }, [feature, activeItem]);

  const potContent = useMemo(() => {
    switch (feature) {
      case "mainPot":
        return activeItem.mainPot.potIds.map((id, i) => (
          <PotentialLineBadge
            key={`${id}-${i}`}
            rank={PotManager.getPotentialMetadata(id).rank}
            text={PotManager.resolvePotential(id, level, subcategory).display}
          />
        ));
      case "additionalPot":
        return activeItem.additionalPot.potIds.map((id, i) => (
          <PotentialLineBadge
            key={`${id}-${i}`}
            rank={PotManager.getPotentialMetadata(id).rank}
            text={PotManager.resolvePotential(id, level, subcategory).display}
          />
        ));
      case "soul":
        return soul ? (
          <PotentialLineBadge text={SoulManager.getLine(soul, level)} />
        ) : (
          <p>尚未設定</p>
        );
    }
  }, [feature, activeItem]);

  return (
    <div className="bg-glass/50 flex flex-col justify-center gap-4 rounded-xl p-4">
      {potBanner}
      <div className="grid justify-center gap-2">{potContent}</div>
    </div>
  );
}
