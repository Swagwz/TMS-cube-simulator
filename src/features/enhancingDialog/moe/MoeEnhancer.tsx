import { useMemo } from "react";
import MoeCubeEnhancer from "./enhancer/MoeCubeEnhancer";
import MoeRestoreEnhancer from "./enhancer/MoeRestoreEnhancer";
import { useMoeEnhancingContext } from "@/contexts/useMoeEnhancingContext";

export default function MoeEnhancer() {
  const { selectedItemId } = useMoeEnhancingContext();

  return useMemo(() => {
    switch (selectedItemId) {
      case "moeCube":
        return <MoeCubeEnhancer />;
      case "moeRestore":
        return <MoeRestoreEnhancer />;
    }
  }, [selectedItemId]);
}
