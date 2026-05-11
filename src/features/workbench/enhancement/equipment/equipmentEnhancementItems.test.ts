import { describe, expect, it } from "vitest";
import type { EquipmentInstance } from "@/store/useEquipmentStore";
import {
  canUseEquipmentEnhancementItem,
  getEquipmentEnhancementItemsForFeature,
} from "./equipmentEnhancementItems";

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
        mainPot: {
          craftsmanCube: 3,
        },
        additionalPot: {
          additionalCube: 5,
        },
        soul: {
          wuGongJewel: 7,
        },
      },
    },
    ...overrides,
  };
}

describe("equipmentEnhancementItems", () => {
  it("returns main potential cube items with counts", () => {
    const items = getEquipmentEnhancementItemsForFeature(
      createEquipment(),
      "mainPot",
    );

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.kind === "cube")).toBe(true);
    expect(items.every((item) => item.feature === "mainPot")).toBe(true);
    expect(items.find((item) => item.id === "craftsmanCube")?.count).toBe(3);
  });

  it("returns soul items with counts", () => {
    const items = getEquipmentEnhancementItemsForFeature(
      createEquipment(),
      "soul",
    );

    expect(items).toEqual([
      expect.objectContaining({
        id: "wuGongJewel",
        kind: "soul",
        feature: "soul",
        count: 7,
        disabled: false,
      }),
    ]);
  });

  it("disables soul items for equipment without soul capability", () => {
    const equipment = createEquipment({
      subcategory: "hat",
    });

    expect(canUseEquipmentEnhancementItem(equipment, "wuGongJewel")).toBe(
      false,
    );
    expect(
      getEquipmentEnhancementItemsForFeature(equipment, "soul")[0]?.disabled,
    ).toBe(true);
  });
});
