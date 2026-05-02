import { BaseMoeCube } from "./BaseMoeCube";
import { DirectMoeCube } from "./DirectMoeCube";
import { ToggleMoeCube } from "./ToggleMoeCube";
import { MoeCubeId } from "@/domains/enhancement/moe/moe.type";

export class MoeCubeFactory {
  static create(id: MoeCubeId): BaseMoeCube {
    switch (id) {
      case "moeRestoreCube":
        return new ToggleMoeCube(id);
      case "moeCube":
        return new DirectMoeCube(id);
      default:
        throw new Error(`MoeCube ${id} is not registered in Factory`);
    }
  }
}
