import { useMemo } from "react";
import RestoreCubeEnhancer from "./enhancer/RestoreCubeEnhancer";
import HexaCubeEnhancer from "./enhancer/HexaCubeEnhancer";
import CombineCubeEnhancer from "./enhancer/CombineCubeEnhancer";
import EqualCubeEnhancer from "./enhancer/EqualCubeEnhancer";
import MirrorCubeEnhancer from "./enhancer/MirrorCubeEnhancer";
import CraftsmanCubeEnhancer from "./enhancer/CraftsmanCubeEnhancer";
import MasterCraftsmanCubeEnhancer from "./enhancer/MasterCraftsmanCubeEnhancer";
import AdditionalCubeEnhancer from "./enhancer/AdditionalCubeEnhancer";
import RestoreAdditionalCubeEnhancer from "./enhancer/RestoreAdditionalCubeEnhancer";
import ShinyAdditionalCubeEnhancer from "./enhancer/ShinyAdditionalCubeEnhancer";
import AbsAdditionalCubeEnhancer from "./enhancer/AbsAdditionalCubeEnhancer";
import CombineAdditionalCubeEnhancer from "./enhancer/CombineAdditionalCubeEnhancer";
import WuGongJewelEnhancer from "./enhancer/WuGongJewelEnhancer";
import { useEnhancingContext } from "@/contexts/useEnhancingContext";

export default function Enhancer() {
  const { selectedEhmId } = useEnhancingContext();

  return useMemo(() => {
    switch (selectedEhmId) {
      case "restoreCube":
        return <RestoreCubeEnhancer />;
      case "hexaCube":
        return <HexaCubeEnhancer />;
      case "combineCube":
        return <CombineCubeEnhancer />;
      case "equalCube":
        return <EqualCubeEnhancer />;
      case "mirrorCube":
        return <MirrorCubeEnhancer />;
      case "craftsmanCube":
        return <CraftsmanCubeEnhancer />;
      case "masterCraftsmanCube":
        return <MasterCraftsmanCubeEnhancer />;
      case "additionalCube":
        return <AdditionalCubeEnhancer />;
      case "restoreAdditionalCube":
        return <RestoreAdditionalCubeEnhancer />;
      case "shinyAdditionalCube":
        return <ShinyAdditionalCubeEnhancer />;
      case "absAdditionalCube":
        return <AbsAdditionalCubeEnhancer />;
      case "combineAdditionalCube":
        return <CombineAdditionalCubeEnhancer />;
      case "wuGongJewel":
        return <WuGongJewelEnhancer />;
    }
  }, [selectedEhmId]);
}
