import { describe, expect, it } from "vitest";
import { CryptoRNG } from "./cryptoRng";
import { FixedRNG } from "./fixedRng";
import { SeededRNG } from "./seededRng";

describe("CryptoRNG", () => {
  it("returns a value in [0, 1)", () => {
    const value = new CryptoRNG().next();

    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });
});

describe("FixedRNG", () => {
  it("returns configured values and repeats the final value", () => {
    const rng = new FixedRNG([0.1, 0.5]);

    expect(rng.next()).toBe(0.1);
    expect(rng.next()).toBe(0.5);
    expect(rng.next()).toBe(0.5);
  });

  it("rejects empty sequences", () => {
    expect(() => new FixedRNG([])).toThrow(
      "FixedRNG requires at least one value",
    );
  });
});

describe("SeededRNG", () => {
  it("is repeatable for the same seed", () => {
    const first = new SeededRNG(123);
    const second = new SeededRNG(123);

    expect([first.next(), first.next(), first.next()]).toEqual([
      second.next(),
      second.next(),
      second.next(),
    ]);
  });
});
