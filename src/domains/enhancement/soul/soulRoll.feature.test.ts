import { describe, expect, it } from "vitest";
import { FixedRNG } from "@/domains/random/fixedRng";
import { rollSoulPotential } from "./soulRoll.feature";

describe("rollSoulPotential", () => {
  it("uses the injected rng to pick a deterministic soul id", () => {
    const pool = [
      { id: "soul-a", weight: 2 },
      { id: "soul-b", weight: 3 },
      { id: "soul-c", weight: 5 },
    ];

    expect(rollSoulPotential({ pool, rng: new FixedRNG([0]) })).toBe("soul-a");
    expect(rollSoulPotential({ pool, rng: new FixedRNG([0.25]) })).toBe(
      "soul-b",
    );
    expect(rollSoulPotential({ pool, rng: new FixedRNG([0.9]) })).toBe(
      "soul-c",
    );
  });
});
