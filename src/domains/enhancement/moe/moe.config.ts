import moeCube from "@/assets/enhancementItem/萌獸方塊.png";
import moeRestore from "@/assets/enhancementItem/萌獸恢復方塊.png";
import type { MoeCubeId, MoeCubeMetadata } from "./moe.type";

export const MOE_CUBE_LIST: MoeCubeMetadata[] = [
  {
    id: "moeCube",
    name: "萌獸方塊",
    price: 30,
    description: "用於重設萌獸卡的潛能屬性。",
    discount: 10,
    apply: "moe",
    imagePath: moeCube,
  },
  {
    id: "moeRestore",
    name: "萌獸恢復方塊",
    price: 40,
    description: "使用後可預覽重設結果，並由玩家選擇保留原始潛能或套用新潛能。",
    discount: 10,
    apply: "moe",
    imagePath: moeRestore,
  },
];

export const MOE_CUBE_METADATA_MAP = new Map<MoeCubeId, MoeCubeMetadata>(
  MOE_CUBE_LIST.map((cube) => [cube.id, cube]),
);
