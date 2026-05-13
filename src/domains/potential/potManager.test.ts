import { describe, expect, it } from "vitest";
import { PotManager } from "./potManager";

const LIMITED_SKILL_A = "64a3d7a4-92e2-4e18-9759-a8a13d8c03ba";
const LIMITED_SKILL_B = "b7030867-5975-40c6-b64c-4369a43a15dd";
const LIMITED_SKILL_C = "45af7319-a03f-4e43-bdbc-2678a9ff70f0";
const UNLIMITED_POTENTIAL = "d0e99571-0943-4b48-aa03-1793f00929fb";

describe("PotManager.validateLineReplacement", () => {
  it("allows replacing one line on an already invalid group with an unlimited potential", () => {
    expect(
      PotManager.validateLineReplacement(
        [LIMITED_SKILL_A, LIMITED_SKILL_B, UNLIMITED_POTENTIAL],
        2,
        UNLIMITED_POTENTIAL,
      ),
    ).toBe(true);
  });

  it("rejects a limited replacement when the same limit key is already at max", () => {
    expect(
      PotManager.validateLineReplacement(
        [LIMITED_SKILL_A, LIMITED_SKILL_B, UNLIMITED_POTENTIAL],
        2,
        LIMITED_SKILL_C,
      ),
    ).toBe(false);
  });

  it("excludes the replaced line when counting the matching limit key", () => {
    expect(
      PotManager.validateLineReplacement(
        [LIMITED_SKILL_A, UNLIMITED_POTENTIAL, UNLIMITED_POTENTIAL],
        0,
        LIMITED_SKILL_B,
      ),
    ).toBe(true);
  });
});
