import { BaseCube } from "./BaseCube";
import { RegularCube } from "./RegularCube";
import { MirrorCube } from "./MirrorCube";
import { ShiningCube } from "./ShiningCube";
import { RestoreCube } from "./RestoreCube";
import { CombineCube } from "./CombineCube";
import { GlitterCube } from "./GlitterCube";
import { CubeId } from "@/domains/cube/type";
import { EquipmentApplicableEhmId } from "../equipment/equipment.type";
import { SoulOrb } from "../soul/SoulOrb";

export class EnhancementFactory {
  static create(id: EquipmentApplicableEhmId): BaseCube | SoulOrb {
    switch (id) {
      case "mirrorCube":
        return new MirrorCube();
      case "shinyAdditionalCube":
        return new ShiningCube();
      case "hexaCube":
        return new GlitterCube();
      case "wuGongJewel":
        return new SoulOrb(id);

      // 恢復類
      case "restoreCube":
      case "restoreAdditionalCube":
        return new RestoreCube(
          id as CubeId,
          id.includes("Additional") ? "additionalPot" : "mainPot",
        );

      // 結合類
      case "combineCube":
      case "combineAdditionalCube":
        return new CombineCube(
          id as CubeId,
          id.includes("Additional") ? "additionalPot" : "mainPot",
        );

      // 直接洗類
      case "craftsmanCube":
      case "masterCraftsmanCube":
      case "equalCube":
      case "additionalCube":
      case "absAdditionalCube":
        return new RegularCube(
          id as CubeId,
          id.includes("additional") || id.includes("abs")
            ? "additionalPot"
            : "mainPot",
        );

      default:
        throw new Error(`Item ${id} is not registered in Factory`);
    }
  }
}
