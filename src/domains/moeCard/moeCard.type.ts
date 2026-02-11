export type MoeCardSubcategory = "normal" | "special";

export type MoeCardMetadata = {
  name: string;
  subcategory: MoeCardSubcategory;
  category: "moe";
};
