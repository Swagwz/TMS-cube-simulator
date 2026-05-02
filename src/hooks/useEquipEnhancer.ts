import { useEnhancingContext } from "@/contexts/useEnhancingContext";
import { useEquipmentStore } from "@/store/useEquipmentStore";
import type { PotentialFeature } from "@/domains/equipment/equipment.type";
import type { PotentialRank } from "@/domains/potential/potential.type";

type Pools<F> = F extends "soul"
  ? { id: string; weight: number }[]
  : Record<PotentialRank, { id: string; weight: number }[]>;

export function useEquipEnhancer<F extends PotentialFeature | "soul">(
  _feature: F,
) {
  const { item, localData: equip, snap, pools, closeModal } =
    useEnhancingContext();

  const handleClose = () => {
    useEquipmentStore.getState().syncInstance(equip);
    closeModal();
  };

  return {
    item,
    equip,
    snap,
    pools,
    handleClose,
  };
}
