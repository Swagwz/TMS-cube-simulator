import { useMemo } from "react";
import WuGongJewelEnhancer from "./enhancer/WuGongJewelEnhancer";
import { useEquipmentEnhancementNavigator } from "@/contexts/useEquipmentEnhancementSessionContext";
import CombineCubeWorkflow from "./workflow/CombineCubeWorkflow";
import DirectCubeWorkflow from "./workflow/DirectCubeWorkflow";
import HexaCubeWorkflow from "./workflow/HexaCubeWorkflow";
import RestoreCubeWorkflow from "./workflow/RestoreCubeWorkflow";

export default function Enhancer() {
  const navigator = useEquipmentEnhancementNavigator();

  return useMemo(() => {
    if (!navigator) return null;

    if (navigator.kind === "soul") {
      return <WuGongJewelEnhancer />;
    }

    switch (navigator.workflow) {
      case "direct":
        return <DirectCubeWorkflow />;
      case "restore":
        return <RestoreCubeWorkflow />;
      case "hexa":
        return <HexaCubeWorkflow />;
      case "combine":
        return <CombineCubeWorkflow />;
    }
  }, [navigator]);
}
