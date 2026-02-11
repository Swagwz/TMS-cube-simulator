import { useEnhancingContext } from "@/contexts/useEnhancingContext";
import { useEquipmentStore } from "@/store/useEquipmentStore";
import type { PotentialFeature } from "@/domains/equipment/equipment.type";
import type { PotentialRank } from "@/domains/potential/potential.type";

type Pools<F> = F extends "soul"
  ? { id: string; weight: number }[]
  : Record<PotentialRank, { id: string; weight: number }[]>;

export function useEquipEnhancer<F extends PotentialFeature | "soul">(
  feature: F,
) {
  const { localData, setLocalData, poolData, closeModal } =
    useEnhancingContext();

  // 檢查當前 poolData 是否符合預期的 feature
  const isValid = poolData.feature === feature;
  const pools = isValid ? (poolData.pools as Pools<F>) : null;

  if (!pools) throw new Error("Invalid pool data");

  const handleClose = () => {
    useEquipmentStore.getState().syncInstance(localData);
    closeModal();
  };

  return {
    localData,
    setLocalData,
    pools,
    handleClose,
  };
}
