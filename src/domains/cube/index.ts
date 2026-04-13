import { BaseCube } from "./BaseCube";
import { craftsmanCube } from "./CraftsmanCube";
import { masterCraftsmanCube } from "./MasterCraftsmanCube";
import { additionalCube } from "./AdditionalCube";
import { equalCube } from "./EqualCube";
import { mirrorCube } from "./MirrorCube";
import { restoreCube } from "./RestoreCube";
import { restoreAdditionalCube } from "./RestoreAdditionalCube";
import { shiningCube } from "./ShiningCube";
import { hexaCube } from "./HexaCube";
import { combineCube } from "./CombineCube";
import { combineAdditionalCube } from "./CombineAdditionalCube";
import { absAdditionalCube } from "./AbsAdditionalCube";
import type { EnhancementItem } from "../equipment/EnhancementItem";
import type { CubeId } from "../enhancement/cube/cube.type";
import type { PotentialFeature } from "../equipment/equipment.type";

const registry: BaseCube[] = [
  craftsmanCube,
  masterCraftsmanCube,
  additionalCube,
  equalCube,
  mirrorCube,
  restoreCube,
  restoreAdditionalCube,
  shiningCube,
  hexaCube,
  combineCube,
  combineAdditionalCube,
  absAdditionalCube,
];

/**
 * CubeRegistry 統一管理所有方塊實例，作為領域層的查詢入口
 */
export const CubeRegistry = {
  getById: (id: CubeId) => registry.find((c) => c.cubeId === id),

  /**
   * 提供 UI 層篩選服務：取得該裝備與部位可用的方塊
   */
  getApplicable: (apply: PotentialFeature, equip: EnhancementItem) =>
    registry.filter((c) => c.apply === apply && c.canApply(equip)),

  getAll: () => registry,
};
