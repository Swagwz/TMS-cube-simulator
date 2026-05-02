import { MoeCubeId } from "@/domains/enhancement/moe/moe.type";
import { MoeCardSubcategory } from "@/domains/moeCard/moeCard.type";
import { PotentialResult } from "@/domains/shared/types";

/**
 * 萌獸方塊基類
 */
export abstract class BaseMoeCube {
  abstract readonly id: MoeCubeId;
  abstract readonly uiType: "direct" | "toggle";

  /**
   * 執行洗潛能
   * 注意：萌獸目前的資料模型與裝備不同，我們暫時保持其獨立性
   */
  abstract roll(subcategory: MoeCardSubcategory): PotentialResult;
}
