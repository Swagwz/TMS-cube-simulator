import { useMemo } from "react";
import WuGongJewelEnhancer from "./enhancer/WuGongJewelEnhancer";
import { useEnhancingContext } from "@/contexts/useEnhancingContext";
import { getCubeDefinition } from "@/domains/enhancement/cube/cube.registry";
import type { CubeId } from "@/domains/enhancement/cube/cube.type";
import CombineCubeWorkflow from "./workflow/CombineCubeWorkflow";
import DirectCubeWorkflow from "./workflow/DirectCubeWorkflow";
import HexaCubeWorkflow from "./workflow/HexaCubeWorkflow";
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

    if (cube.workflow === "hexa") {
      return cubeSession ? <HexaCubeWorkflow /> : null;
    }

    if (cube.workflow === "combine") {
      return cubeSession ? <CombineCubeWorkflow /> : null;
    }
  }, [cubeSession, selectedItemId]);
}
