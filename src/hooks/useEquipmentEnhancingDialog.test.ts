import { describe, expect, it } from "vitest";
import type { EquipmentInstance } from "@/store/useEquipmentStore";
import { createEquipmentEnhancingDialogRequest } from "./useEquipmentEnhancingDialog";

function createEquipment(
  overrides: Partial<EquipmentInstance> = {},
): EquipmentInstance {
  return {
    id: "equipment-1",
    entity: "equipment",
    subcategory: "primary-weapon",
    level: 200,
    mainPot: {
      tier: "rare",
      potentialIds: ["main-1", "main-2", "main-3"],
    },
    additionalPot: {
      tier: "rare",
      potentialIds: ["add-1", "add-2", "add-3"],
    },
    soul: null,
    _origin: {
      mainPot: {
        tier: "rare",
        potentialIds: ["main-1", "main-2", "main-3"],
      },
      additionalPot: {
        tier: "rare",
        potentialIds: ["add-1", "add-2", "add-3"],
      },
      soul: null,
    },
    statistics: {
      counts: {
        mainPot: {},
        additionalPot: {},
        soul: {},
      },
    },
    ...overrides,
  };
}

describe("createEquipmentEnhancingDialogRequest", () => {
  it("creates a dialog request for an applicable main potential cube", () => {
    expect(
      createEquipmentEnhancingDialogRequest(
        createEquipment(),
        "craftsmanCube",
      ),
    ).toEqual({
      equipmentId: "equipment-1",
      itemId: "craftsmanCube",
    });
  });

  it("returns null when the enhancement item cannot be applied", () => {
    expect(
      createEquipmentEnhancingDialogRequest(
        createEquipment({ subcategory: "hat" }),
        "wuGongJewel",
      ),
    ).toBeNull();
  });
});
