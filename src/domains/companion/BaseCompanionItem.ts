import type { EnhancementItem } from "../equipment/EnhancementItem";
import type { CompanionItemId } from "./type";

export abstract class BaseCompanionItem {
  abstract readonly itemId: CompanionItemId;
  abstract readonly name: string;
  abstract readonly imageUrl: string;
  abstract readonly price: number;

  incrementCount(equip: EnhancementItem) {
    equip.incrementCount(this.itemId);
  }
}
