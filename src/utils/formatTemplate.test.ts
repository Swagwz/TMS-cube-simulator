import { describe, it, expect } from "vitest";
import formatTemplate from "./formatTemplate"; // 假設檔名為 formatTemplate.ts

describe("formatTemplate", () => {
  it("should replace {x} with the provided value", () => {
    const template = "Value of X is {x}";
    const result = formatTemplate(template, { x: 100 });
    expect(result).toBe("Value of X is 100");
  });

  it("should replace both {x} and {y} when both are provided", () => {
    const template = "Coordinates: {x}, {y}";
    const result = formatTemplate(template, { x: 10, y: 20 });
    expect(result).toBe("Coordinates: 10, 20");
  });

  it("should correctly handle the number 0 (not treat it as falsy empty string)", () => {
    const template = "The score is {x}";
    const result = formatTemplate(template, { x: 0 });
    // 如果你代碼用的是 (value[ph] || "")，這裡會變成 "The score is "
    // 如果用 (value[ph] ?? "")，這裡會是正確的 "The score is 0"
    expect(result).toBe("The score is 0");
  });

  it("should replace {y} with an empty string if y is not provided", () => {
    const template = "X: {x}, Y: {y}";
    const result = formatTemplate(template, { x: 5 });
    expect(result).toBe("X: 5, Y: ");
  });

  it("should not affect other text in the template", () => {
    const template = "Keep this {z} and {x}";
    const result = formatTemplate(template, { x: 1 });
    expect(result).toBe("Keep this {z} and 1");
  });

  it("should only replace the first occurrence of a placeholder (JS string.replace behavior)", () => {
    // 這是針對你目前 code 使用 .replace(string, string) 的特性測試
    const template = "{x} and {x}";
    const result = formatTemplate(template, { x: 1 });
    expect(result).toBe("1 and {x}");
  });
});
