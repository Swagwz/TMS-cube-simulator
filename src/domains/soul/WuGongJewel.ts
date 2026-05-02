import wuGongJewelImg from "@/assets/enhancementItem/武公寶珠.png";
import { BaseSoulOrb } from "./BaseSoulOrb";

export class WuGongJewel extends BaseSoulOrb {
  readonly id = "wuGongJewel" as const;
  readonly name = "武公寶珠";
  readonly description = "對武器使用後，可賦予其武公的靈魂寶珠能力。";
  readonly imageUrl = wuGongJewelImg;
  readonly price = 5500;
}

export const wuGongJewel = new WuGongJewel();
