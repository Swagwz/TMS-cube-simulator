/**
 * trim whitespace and capitalize only the first character
 * @param str string
 * @returns string
 */
export function capitalize(str: string) {
  const trimmed = str.trim().toLowerCase();

  if (!trimmed) return "";

  return trimmed[0].toUpperCase() + trimmed.slice(1);
}
