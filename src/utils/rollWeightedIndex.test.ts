import { describe, expect, it } from "vitest";
import { FixedRNG } from "@/domains/random/fixedRng";
import { rollWeightedIndex } from "./rollWeightedIndex";

describe("rollWeightedIndex", () => {
  it("returns index 0 when rng value is low", () => {
    expect(rollWeightedIndex([20, 80], new FixedRNG([0.1]))).toBe(0);
  });

  it("returns index 1 when rng value is high", () => {
    expect(rollWeightedIndex([20, 80], new FixedRNG([0.5]))).toBe(1);
  });

  it("handles the boundary below cumulative weight", () => {
    expect(rollWeightedIndex([20, 80], new FixedRNG([0.199]))).toBe(0);
  });

  it("always returns the only weighted index when other weights are 0", () => {
    expect(rollWeightedIndex([0, 100, 0], new FixedRNG([0.5]))).toBe(1);
  });

  it("handles single element arrays", () => {
    expect(rollWeightedIndex([50], new FixedRNG([0.99]))).toBe(0);
  });

  it("returns a valid index for a large array", () => {
    const largeWeights = Array.from({ length: 200 }, (_, index) =>
      index === 0 ? 1 : 0,
    );

    const index = rollWeightedIndex(largeWeights, new FixedRNG([0]));

    expect(index).toBe(0);
  });

  it("handles an array where all weights are 0 by returning the last index", () => {
    const allZeros = new Array(200).fill(0);

    expect(rollWeightedIndex(allZeros, new FixedRNG([0.5]))).toBe(199);
  });
});
