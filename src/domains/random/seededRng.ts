import type { RNG } from "./rng.type";

export class SeededRNG implements RNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next() {
    this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0;
    return this.state / 2 ** 32;
  }
}
