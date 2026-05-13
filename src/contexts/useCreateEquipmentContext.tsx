import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EquipmentRank } from "@/domains/potential/potential.type";
import type { EquipData } from "@/store/useEquipmentStore";
import { produce } from "immer";
import { EquipManager } from "@/domains/equipment/equipManager";
import { PotManager } from "@/domains/potential/potManager";
import type {
  EquipmentSubcategory,
  PotentialFeature,
} from "@/domains/equipment/equipment.type";
import EQUIPMENT_LIST from "@/domains/equipment/equipment.config";
import { rollValidPotIds } from "@/domains/equipment/equipmentPotentialRoll";

type ContextState = { equipmentData: EquipData };

type ContextActions = {
  resetData: () => void;
  randomPotIds: (feature: PotentialFeature) => void;

  updateLevel: (value: number) => void;
  updateRank: (feature: PotentialFeature, value: string) => void;
  updateType: (value: string) => void;
  updatePot: (feature: PotentialFeature, index: number, id: string) => void;
  updateSoul: (value: string | null) => void;
};

type ContextType = ContextState & ContextActions;

const CreateEquipmentContext = createContext<ContextType | null>(null);

type CreateEquipmentProviderProps = {
  children: ReactNode;
};

export function CreateEquipmentProvider({
  children,
}: CreateEquipmentProviderProps) {
  const [equipmentData, setEquipmentData] = useState<EquipData>(() =>
    generateDefaultEquipData(),
  );

  const actions = useMemo(
    () => ({
      resetData: () => {
        setEquipmentData(generateDefaultEquipData());
      },

      randomPotIds: (feature: PotentialFeature) => {
        setEquipmentData(
          produce((draft) => {
            const {
              subcategory,
              level,
              [feature]: { tier },
            } = draft;

            const prevTier = PotManager.getPrev(tier);
            const params = { subcategory, level, feature };

            const prime = EquipManager.getPotentialOptions({
              ...params,
              rank: tier,
            });
            const nonPrime = EquipManager.getPotentialOptions({
              ...params,
              rank: prevTier,
            });

            draft[feature].potIds = rollValidPotIds({ prime, nonPrime });
          }),
        );
      },

      updateLevel: (value: number) => {
        setEquipmentData((prev) => ({ ...prev, level: value }));
      },

      updateRank: (feature: PotentialFeature, value: string) => {
        setEquipmentData(
          produce((draft) => {
            draft[feature].tier = value as EquipmentRank;
          }),
        );
      },

      updateType: (value: string) => {
        setEquipmentData(
          produce((draft) => {
            const type = value as EquipmentSubcategory;
            draft.subcategory = type;
            draft.level = EquipManager.getLevelConfig(type).defaultLevel;
          }),
        );
      },

      updatePot: (feature: PotentialFeature, index: number, id: string) => {
        setEquipmentData(
          produce((draft) => {
            draft[feature].potIds[index] = id;
          }),
        );
      },

      updateSoul: (value: string | null) => {
        setEquipmentData(
          produce((draft) => {
            draft.soul = value;
          }),
        );
      },
    }),
    [],
  );

  return (
    <CreateEquipmentContext.Provider value={{ equipmentData, ...actions }}>
      {children}
    </CreateEquipmentContext.Provider>
  );
}

export function useCreateEquipmentContext() {
  const context = useContext(CreateEquipmentContext);
  if (!context) {
    throw new Error(
      "useCreateEquipmentContext must be used within createEquipmentContext",
    );
  }
  return context;
}

function generateDefaultEquipData(): EquipData {
  const { subcategory } = EQUIPMENT_LIST[0];
  const defaultLevel = EquipManager.getLevelConfig(subcategory).defaultLevel;
  const defaultTier: EquipmentRank = "legendary";

  const createDefaultPot = (feature: PotentialFeature) => {
    const params = { subcategory, feature, level: defaultLevel };

    const prime = EquipManager.getPotentialOptions({
      ...params,
      rank: defaultTier,
    });
    const nonPrime = EquipManager.getPotentialOptions({
      ...params,
      rank: PotManager.getPrev(defaultTier),
    });

    return {
      tier: defaultTier,
      potIds: rollValidPotIds({ prime, nonPrime }),
    };
  };

  return {
    level: defaultLevel,
    subcategory,
    mainPot: createDefaultPot("mainPot"),
    additionalPot: createDefaultPot("additionalPot"),
    soul: null,
  };
}
