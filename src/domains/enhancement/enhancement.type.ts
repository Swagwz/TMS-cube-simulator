export type EnhancementItemBase = {
  name: string;
  description: string;
  imagePath: string;
  price: number;
  discount: number;
};

export type WorkbenchEntityType = "equipment" | "moe";
