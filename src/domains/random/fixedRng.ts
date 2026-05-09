import type { RNG } from "./rng.type";

export class FixedRNG implements RNG {
  private readonly values: number[];
  private index = 0;

  constructor(values: number[]) {
    if (values.length === 0) {
      throw new Error("FixedRNG requires at least one value");
    }

    this.values = [...values];
  }

  next() {
    const value = this.values[Math.min(this.index, this.values.length - 1)];
    this.index += 1;

    if (value < 0 || value >= 1) {
      throw new Error("RNG values must be in [0, 1)");
    }

    return value;
  }
}
