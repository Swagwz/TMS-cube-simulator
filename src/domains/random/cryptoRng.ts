import type { RNG } from "./rng.type";

export class CryptoRNG implements RNG {
  next() {
    const cryptoApi = globalThis.crypto;
    if (!cryptoApi?.getRandomValues) {
      throw new Error("crypto.getRandomValues is not available");
    }

    const values = new Uint32Array(1);
    cryptoApi.getRandomValues(values);
    return values[0] / 2 ** 32;
  }
}
