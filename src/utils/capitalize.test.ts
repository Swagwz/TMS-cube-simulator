import { describe, it, expect } from "vitest";
import { capitalize } from "./capitalize";

describe("capitalize fn", () => {
  it("should capitalize the first letter and lowercase the rest", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("WORLD")).toBe("World");
    expect(capitalize("aBC dEF")).toBe("Abc def");
  });

  it("should trim leading and trailing whitespace", () => {
    expect(capitalize("  hello  ")).toBe("Hello");
    expect(capitalize("\n new line")).toBe("New line");
    expect(capitalize("\t tabbed")).toBe("Tabbed");
  });

  it("should return an empty string when input is empty or only whitespace", () => {
    expect(capitalize("")).toBe("");
    expect(capitalize("   ")).toBe("");
  });

  it("should handle single characters correctly", () => {
    expect(capitalize("a")).toBe("A");
    expect(capitalize(" Z ")).toBe("Z");
  });

  it("should handle strings that are already correctly capitalized", () => {
    expect(capitalize("Nextjs")).toBe("Nextjs");
  });
});
