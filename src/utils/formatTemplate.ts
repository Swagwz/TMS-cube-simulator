const placeholders = ["x", "y"] as const;

/**
 * Replaces placeholders (e.g., {x}, {y}) in a template string with provided numeric values.
 * * @param template - The string containing placeholders like "{x}" or "{y}".
 * @param value - An object containing the replacement values for x and y.
 * @returns The formatted string with placeholders replaced by their respective values.
 */
export default function formatTemplate(
  template: string,
  value: { x: number; y?: number },
) {
  let rst = template;

  for (let ph of placeholders) {
    // Replace the placeholder globally if it exists in the template
    rst = rst.replace(`{${ph}}`, (value[ph] ?? "").toString());
  }

  return rst;
}
