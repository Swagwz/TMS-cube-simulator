import { describe, expect, it } from "vitest";
import { resolveEquipmentEnhancementNavigator } from "./useEquipmentEnhancementNavigator";
import type {
  EquipmentCubeSessionController,
  EquipmentSoulSessionController,
} from "@/contexts/useEquipmentEnhancementSessionContext";

const cubeController = {
  cube: {
    workflow: "direct",
  },
} as EquipmentCubeSessionController;

const soulController = {} as EquipmentSoulSessionController;

describe("resolveEquipmentEnhancementNavigator", () => {
  it("returns null when no item is selected", () => {
    expect(
      resolveEquipmentEnhancementNavigator({
        itemId: null,
        cubeController: null,
        soulController: null,
      }),
    ).toBeNull();
  });

  it("returns soul navigator for soul items", () => {
    expect(
      resolveEquipmentEnhancementNavigator({
        itemId: "wuGongJewel",
        cubeController: null,
        soulController,
      }),
    ).toEqual({
      kind: "soul",
      controller: soulController,
    });
  });

  it("returns cube navigator with workflow for cube items", () => {
    expect(
      resolveEquipmentEnhancementNavigator({
        itemId: "craftsmanCube",
        cubeController,
        soulController: null,
      }),
    ).toEqual({
      kind: "cube",
      workflow: "direct",
      controller: cubeController,
    });
  });
});
