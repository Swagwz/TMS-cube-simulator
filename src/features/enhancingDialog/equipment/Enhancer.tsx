import { useMemo } from "react";
import HexaCubeEnhancer from "./enhancer/HexaCubeEnhancer";
import CombineCubeEnhancer from "./enhancer/CombineCubeEnhancer";
import CombineAdditionalCubeEnhancer from "./enhancer/CombineAdditionalCubeEnhancer";
import WuGongJewelEnhancer from "./enhancer/WuGongJewelEnhancer";
import { useEnhancingContext } from "@/contexts/useEnhancingContext";
import { getCubeDefinition } from "@/domains/enhancement/cube/cube.registry";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import DirectCubeWorkflow from "./workflow/DirectCubeWorkflow";
import RestoreCubeWorkflow from "./workflow/RestoreCubeWorkflow";
import { useOptionalEquipmentCubeSession } from "@/contexts/useEquipmentCubeSessionContext";

export default function Enhancer() {
  const { selectedItemId } = useEnhancingContext();
  const cubeSession = useOptionalEquipmentCubeSession();

  return useMemo(() => {
    if (selectedItemId === "wuGongJewel") {
      return <WuGongJewelEnhancer />;
    }

    const cube = getCubeDefinition(selectedItemId as CubeId);
    if (cube.workflow === "direct") {
      return cubeSession ? <DirectCubeWorkflow /> : null;
    }

    if (cube.workflow === "restore") {
      return cubeSession ? <RestoreCubeWorkflow /> : null;
    }

    switch (selectedItemId) {
      case "hexaCube":
        return <HexaCubeEnhancer />;
      case "combineCube":
        return <CombineCubeEnhancer />;
      case "combineAdditionalCube":
        return <CombineAdditionalCubeEnhancer />;
    }
  }, [cubeSession, selectedItemId]);
}
