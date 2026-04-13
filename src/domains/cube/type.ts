export type CubeId = MainCubeId | AdditionalCubeId;

export type MainCubeId =
  | "restoreCube"
  | "hexaCube"
  | "combineCube"
  | "equalCube"
  | "mirrorCube"
  | "craftsmanCube"
  | "masterCraftsmanCube";

export type AdditionalCubeId =
  | "additionalCube"
  | "restoreAdditionalCube"
  | "shinyAdditionalCube"
  | "absAdditionalCube"
  | "combineAdditionalCube";
