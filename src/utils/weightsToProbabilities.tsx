export function weightsToProbabilities(weights: number[]) {
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => w / sum);
}
