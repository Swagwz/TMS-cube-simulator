import { CUBE_METADATA_MAP, COMPANION_METADATA_MAP } from "./cube/cube.config";
import type { EhmId } from "./enhancement.type";
import { MOE_CUBE_METADATA_MAP } from "./moe/moe.config";
import { SOUL_METADATA_MAP } from "./soul/soul.config";

export const EnhancementManager = {
  /**
   * 根據 ID 查找任何強化道具 (Cube, Soul, MoeCube) 的 Metadata
   */
  getItem(id: EhmId) {
    const item =
      CUBE_METADATA_MAP.get(id as any) ||
      SOUL_METADATA_MAP.get(id as any) ||
      MOE_CUBE_METADATA_MAP.get(id as any) ||
      COMPANION_METADATA_MAP.get(id as any);

    if (!item) {
      throw new Error(`Enhancement item not found: ${id}`);
    }

    return item;
  },
};
