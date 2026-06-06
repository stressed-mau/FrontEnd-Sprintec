export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function toStringValue(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string"
    ? value
    : value == null
    ? fallback
    : String(value);
}