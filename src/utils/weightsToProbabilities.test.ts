import { describe, it, expect } from "vitest";
import { weightsToProbabilities } from "./weightsToProbabilities";

function sum(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0);
}

describe("weightsToProbabilities", () => {
  it("should convert simple weights to correct probabilities", () => {
    const weights = [1, 3];
    const result = weightsToProbabilities(weights);

    expect(result).toEqual([0.25, 0.75]);
    // Ensure the sum is exactly 1
    expect(sum(result)).toBe(1);
  });

  it("should handle large arrays (length 200) with various weights", () => {
    const largeWeights = Array.from({ length: 200 }, () => Math.random() * 100);
    const result = weightsToProbabilities(largeWeights);

    expect(result).toHaveLength(200);

    // Check if the sum of probabilities is approximately 1 (handling floating point)
    expect(sum(result)).toBeCloseTo(1, 6);
  });

  it("should handle weights that include 0", () => {
    const weights = [0, 50, 50];
    const result = weightsToProbabilities(weights);

    expect(result).toEqual([0, 0.5, 0.5]);
  });

  it("should handle an array with a single element", () => {
    expect(weightsToProbabilities([100])).toEqual([1]);
  });

  it("should avoid NaN if all weights are 0 (Edge Case)", () => {
    // Note: In your original code, 0/0 results in NaN.
    // If you add the 'if (sum === 0)' check I included in JSDoc, this passes.
    const weights = [0, 0, 0];
    const result = weightsToProbabilities(weights);
    expect(result).toEqual([0, 0, 0]);
  });
});
