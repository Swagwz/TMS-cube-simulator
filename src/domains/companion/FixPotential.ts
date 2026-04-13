import fixPotentialImg from "@/assets/enhancementItem/固定潛能.png";
import { BaseCompanionItem } from "./BaseCompanionItem";

class FixPotential extends BaseCompanionItem {
  readonly imageUrl = fixPotentialImg;
  readonly itemId = "fixPotential";
  readonly name = "固定潛能";
  readonly price = 0;
}

export const fixPotential = new FixPotential();
