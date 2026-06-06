export const DAY_KEYS_ES = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export const DAY_KEYS_EN = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const TEMPLATE_COLORS = [
  "bg-[#003A6C]",
  "bg-[#4D88B3]",
  "bg-[#0E7D96]",
];

export function capitalizeLabel(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function formatPeriodLabel(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);

  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

export function buildTrendFooterBadge(variation: number, isTopTemplate: boolean) {
  if (isTopTemplate) {
    return "LIDERA LA SEMANA";
  }
  if (variation > 0) {
    return "VARIACIÓN POSITIVA";
  }
  if (variation < 0) {
    return "VARIACIÓN NEGATIVA";
  }
  return "VARIACIÓN ESTABLE";
}

export function formatTemplateVariation(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

export function formatTemplateTime(value: number) {
  return `${value} s`;
}
