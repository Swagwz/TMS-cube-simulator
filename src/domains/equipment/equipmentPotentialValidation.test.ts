import { describe, expect, it } from "vitest";
import { rollValidPotIds } from "./equipmentPotentialRoll";
import {
  formatEquipmentPotentialValidationMessage,
  validateEquipmentPotentialGroups,
} from "./equipmentPotentialValidation";
import { getEquipmentFeatureLabel } from "./equipmentFeature.config";
import { PotManager } from "@/domains/potential/potManager";

const LIMITED_SKILL_A = "64a3d7a4-92e2-4e18-9759-a8a13d8c03ba";
const LIMITED_SKILL_B = "b7030867-5975-40c6-b64c-4369a43a15dd";
const UNLIMITED_POTENTIAL = "d0e99571-0943-4b48-aa03-1793f00929fb";

describe("validateEquipmentPotentialGroups", () => {
  it("rejects a main potential group that exceeds a shared limit", () => {
    const result = validateEquipmentPotentialGroups({
      mainPot: {
        potentialIds: [LIMITED_SKILL_A, LIMITED_SKILL_A, UNLIMITED_POTENTIAL],
      },
      additionalPot: {
        potentialIds: [
          UNLIMITED_POTENTIAL,
          UNLIMITED_POTENTIAL,
          UNLIMITED_POTENTIAL,
        ],
      },
    });

    expect(result.valid).toBe(false);
    expect(result.invalidFeatures).toEqual(["mainPot"]);
    expect(formatEquipmentPotentialValidationMessage(result)).toContain(
      getEquipmentFeatureLabel("mainPot"),
    );
  });

  it("rejects an additional potential group that exceeds a shared limit", () => {
    const result = validateEquipmentPotentialGroups({
      mainPot: {
        potentialIds: [
          UNLIMITED_POTENTIAL,
          UNLIMITED_POTENTIAL,
          UNLIMITED_POTENTIAL,
        ],
      },
      additionalPot: {
        potentialIds: [LIMITED_SKILL_A, LIMITED_SKILL_B, UNLIMITED_POTENTIAL],
      },
    });

    expect(result.valid).toBe(false);
    expect(result.invalidFeatures).toEqual(["additionalPot"]);
    expect(formatEquipmentPotentialValidationMessage(result)).toContain(
      getEquipmentFeatureLabel("additionalPot"),
    );
  });

  it("accepts valid main and additional potential groups", () => {
    const result = validateEquipmentPotentialGroups({
      mainPot: {
        potentialIds: [LIMITED_SKILL_A, UNLIMITED_POTENTIAL, UNLIMITED_POTENTIAL],
      },
      additionalPot: {
        potentialIds: [
          UNLIMITED_POTENTIAL,
          UNLIMITED_POTENTIAL,
          UNLIMITED_POTENTIAL,
        ],
      },
    });

    expect(result.valid).toBe(true);
    expect(result.invalidFeatures).toEqual([]);
  });
});

describe("rollValidPotIds", () => {
  it("falls back to a deterministic valid combination after invalid random rolls", () => {
    const potIds = rollValidPotIds({
      prime: [LIMITED_SKILL_A, LIMITED_SKILL_B, UNLIMITED_POTENTIAL],
      nonPrime: [],
      random: () => 0,
      attempts: 1,
    });

    expect(potIds).toHaveLength(3);
    expect(PotManager.validateLineRules(potIds)).toBe(true);
  });
});
