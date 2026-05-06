import { describe, expect, it } from "vitest";
import { CubeManager } from "./cubeManager";

describe("CubeManager.getScaledRankUpWeights", () => {
  it("applies rank-up multiplier only to the first rank-up weight from rare tier", () => {
    const weights = CubeManager.getScaledRankUpWeights(
      "restoreCube",
      "rare",
      2,
    );

    expect(weights[0]).toBeCloseTo(0);
    expect(weights[1]).toBeCloseTo(195.4);
    expect(weights[2]).toBeCloseTo(2);
    expect(weights[3]).toBeCloseTo(0.3);
  });

  it("applies rank-up multiplier only to the first rank-up weight", () => {
    const weights = CubeManager.getScaledRankUpWeights(
      "restoreCube",
      "epic",
      2,
    );

    expect(weights[0]).toBeCloseTo(83.4);
    expect(weights[1]).toBeCloseTo(16);
    expect(weights[2]).toBeCloseTo(0.6);
  });
});
