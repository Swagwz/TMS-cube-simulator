import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MoeData } from "@/store/useMoeStore";
import type { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import { MoeManager } from "@/domains/enhancement/moe/moeManager";

/* -------------------------------------------------------------------------------------------------
 * Context type
 * ----------------------------------------------------------------------------------------------- */

type CreateMoeContextType = {
  moeData: MoeData;
  setMoeData: React.Dispatch<React.SetStateAction<MoeData>>;
  resetData: () => void;
  createMoeData: (moeType: MoeCardSubcategory) => MoeData;
};

/* -------------------------------------------------------------------------------------------------
 * Create context
 * ----------------------------------------------------------------------------------------------- */

const CreateMoeContext = createContext<CreateMoeContextType | null>(null);

/* -------------------------------------------------------------------------------------------------
 * Provider component
 * ----------------------------------------------------------------------------------------------- */
type CreateMoeContextProviderProps = {
  children: ReactNode;
};

export function CreateMoeContextProvider({
  children,
}: CreateMoeContextProviderProps) {
  const [moeData, setMoeData] = useState<MoeData>(() =>
    createMoeData("special"),
  );

  const actions = useMemo(() => {
    return {
      resetData: () => setMoeData(createMoeData("special")),
      createMoeData: (moeType: MoeCardSubcategory) => createMoeData(moeType),
    };
  }, []);

  return (
    <CreateMoeContext.Provider value={{ moeData, setMoeData, ...actions }}>
      {children}
    </CreateMoeContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * custom hook
 * ----------------------------------------------------------------------------------------------- */

export function useCreateMoeContext() {
  const context = useContext(CreateMoeContext);
  if (!context) {
    throw new Error(
      "useCreateMoeContext must be used within EquipManagerContext",
    );
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * helper
 * ----------------------------------------------------------------------------------------------- */

function createMoeData(moeType: MoeCardSubcategory): MoeData {
  const lines = MoeManager.createRandomPotentials(moeType);
  return {
    subcategory: moeType,
    potIds: lines,
  };
}
