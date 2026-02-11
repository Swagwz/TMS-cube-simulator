/**
 * 計算在給定單次成功機率 p 下，達到特定信心水準 (confidence) 所需的嘗試次數 n。
 *
 * 公式推導：
 * 我們希望至少發生一次成功的機率 P(at least one success) >= confidence
 * 1 - P(all failures) >= confidence
 * 1 - (1 - p)^n >= confidence
 * (1 - p)^n <= 1 - confidence
 * n * ln(1 - p) <= ln(1 - confidence)
 * n >= ln(1 - confidence) / ln(1 - p)  (因為 ln(1-p) 為負數，不等號轉向)
 *
 * @param p 單次試驗成功的機率 (0 < p <= 1)
 * @param confidence 信心水準 (0 < confidence < 1)，預設為 0.95 (95%)
 * @returns 需要的嘗試次數 n
 */
export default function getRequiredCount(p: number, confidence = 0.95) {
  return Math.ceil(Math.log(1 - confidence) / Math.log(1 - p));
}
