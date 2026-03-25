import { describe, it, expect } from "vitest";
import { capitalize } from "./capitalize";

describe("capitalize fn", () => {
  it.each([
    { input: "hello", expected: "Hello" },
    { input: "WORLD", expected: "World" },
    { input: "aBC dEF", expected: "Abc def" },
  ])(
    "should capitalize the first letter and lowercase the rest ($input -> $expected)",
    ({ input, expected }) => {
      expect(capitalize(input)).toBe(expected);
    },
  );

  it.each([
    { input: "  hello  ", expected: "Hello" },
    { input: "\n new line", expected: "New line" },
    { input: "\t tabbed", expected: "Tabbed" },
  ])("should trim leading and trailing whitespace", ({ input, expected }) => {
    expect(capitalize(input)).toBe(expected);
  });

  it.each(["", "   "])(
    "should return an empty string when input is empty or only whitespace",
    (input) => {
      expect(capitalize(input)).toBe("");
    },
  );

  it.each([
    { input: "a", expected: "A" },
    { input: " Z ", expected: "Z" },
  ])("should handle single characters correctly", ({ input, expected }) => {
    expect(capitalize(input)).toBe(expected);
  });

  it("should handle strings that are already correctly capitalized", () => {
    expect(capitalize("Nextjs")).toBe("Nextjs");
  });
});
