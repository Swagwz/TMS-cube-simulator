/**
 * Converts an array of weights into an array of probabilities that sum to 1.
 * * @param weights - An array of numerical weights (e.g., [20, 80]).
 * @returns An array of probabilities where each element is weight / totalSum.
 * * @example
 * weightsToProbabilities([1, 1]); // Returns [0.5, 0.5]
 */
export function weightsToProbabilities(weights: number[]) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights.map(() => 0); // Edge case handling
  return weights.map((w) => w / sum);
}
