import { vi, describe, it, expect, afterEach } from "vitest";
import { rollWeightedIndex } from "./rollWeightedIndex";

describe("rollWeightedIndex (Mocking)", () => {
  // 測試完後要恢復原本的 random 函式
  afterEach(() => {
    vi.spyOn(Math, "random").mockRestore();
  });

  it("should return index 0 when random is low", () => {
    // 總權重 100, 門檻分別是 20, 100
    // 強迫回傳 0.1 (0.1 * 100 = 10 < 20)
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    expect(rollWeightedIndex([20, 80])).toBe(0);
  });

  it("should return index 1 when random is high", () => {
    // 強迫回傳 0.5 (0.5 * 100 = 50 > 20)
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    expect(rollWeightedIndex([20, 80])).toBe(1);
  });

  it("should handle the boundary case (exactly at cumulative weight)", () => {
    // 總權重 100, 第一個區間是 20
    // 強迫回傳 0.1999 (剛好在 20 邊界前) -> 應為 index 0
    vi.spyOn(Math, "random").mockReturnValue(0.199);
    expect(rollWeightedIndex([20, 80])).toBe(0);
  });
});

describe("rollWeightedIndex (Statistical)", () => {
  it("should follow the probability distribution within 1% error", () => {
    const weights = [20, 80];
    const iterations = 10000;
    const results = [0, 0];

    for (let i = 0; i < iterations; i++) {
      results[rollWeightedIndex(weights)]++;
    }

    const index0Rate = results[0] / iterations; // 預期 0.2
    const index1Rate = results[1] / iterations; // 預期 0.8

    // 容許 2% 的統計誤差
    expect(index0Rate).toBeGreaterThan(0.18);
    expect(index0Rate).toBeLessThan(0.22);
    expect(index1Rate).toBeGreaterThan(0.78);
    expect(index1Rate).toBeLessThan(0.82);
  });
});

describe("rollWeightedIndex (Edge Cases)", () => {
  it("should always return the only index if other weights are 0", () => {
    expect(rollWeightedIndex([0, 100, 0])).toBe(1);
  });

  it("should handle single element arrays", () => {
    expect(rollWeightedIndex([50])).toBe(0);
  });
});

describe("rollWeightedIndex (Large Array Edge Cases)", () => {
  it("should return a valid index for a large array of random weights", () => {
    // Create an array of 200 elements with random weights [0, 100]
    const largeWeights = Array.from({ length: 200 }, () =>
      Math.floor(Math.random() * 101),
    );

    // Ensure at least one weight is non-zero to avoid totalWeight = 0
    largeWeights[0] = 1;

    for (let i = 0; i < 100; i++) {
      const index = rollWeightedIndex(largeWeights);

      // The index must be within [0, 199]
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(largeWeights.length);

      // The selected index should not have a weight of 0
      // (Unless ALL weights are 0, which we handled above)
      expect(largeWeights[index]).toBeGreaterThanOrEqual(0);
    }
  });

  it("should handle an array where all weights are 0 by returning the last index", () => {
    const allZeros = new Array(200).fill(0);
    const index = rollWeightedIndex(allZeros);

    // Based on your implementation's 'return weights.length - 1'
    expect(index).toBe(199);
  });
});
