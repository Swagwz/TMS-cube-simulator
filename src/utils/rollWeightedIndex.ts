/**
 * 根據權重陣列隨機回傳一個索引
 * @param weights 權重陣列 (例如 [20, 80] 代表 index 0 有 20% 機率, index 1 有 80% 機率)
 */
export function rollWeightedIndex(weights: number[]): number {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const random = Math.random() * totalWeight;
  let accum = 0;
  for (let i = 0; i < weights.length; i++) {
    accum += weights[i];
    if (random < accum) return i;
  }
  return weights.length - 1;
}
