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

/* -------------------------------------------------------------------------------------------------
 * Context type
 * ----------------------------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------------------------------
 * Create context
 * ----------------------------------------------------------------------------------------------- */

const CreateEquipmentContext = createContext<ContextType | null>(null);

/* -------------------------------------------------------------------------------------------------
 * Provider component
 * ----------------------------------------------------------------------------------------------- */

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
      /** 初始化EquipmentData */
      resetData: () => {
        setEquipmentData(generateDefaultEquipData());
      },
      /** 隨機產生可能的potential lines */
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

            draft[feature].potIds = rollPotIds({ prime, nonPrime });
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

/* -------------------------------------------------------------------------------------------------
 * custom hook
 * ----------------------------------------------------------------------------------------------- */

export function useCreateEquipmentContext() {
  const context = useContext(CreateEquipmentContext);
  if (!context) {
    throw new Error(
      "useCreateEquipmentContext must be used within createEquipmentContext",
    );
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * helper
 * ----------------------------------------------------------------------------------------------- */

type PotentialPool = {
  prime: string[];
  nonPrime: string[];
};

function rollPotIds({ prime, nonPrime }: PotentialPool) {
  const all = [...prime, ...nonPrime];

  if (all.length === 0) return [];

  return Array.from({ length: 3 }, (_, i) => {
    // 第一排保prime
    const list = i === 0 && prime.length > 0 ? prime : all;
    const randomNum = Math.floor(Math.random() * list.length);
    return list[randomNum];
  });
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
      potIds: rollPotIds({ prime, nonPrime }),
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
