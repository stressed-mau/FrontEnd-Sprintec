export function formatPeriodLabel(
  start: string,
  end: string,
) {
  const formatter = new Intl.DateTimeFormat(
    "es-ES",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  return `${formatter.format(
    new Date(`${start}T00:00:00`)
  )} – ${formatter.format(
    new Date(`${end}T00:00:00`)
  )}`;
}

export function getPeriodSearchText(
  start: string,
  end: string,
  index: number,
) {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);

  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  return [
    start,
    end,
    months[s.getMonth()],
    months[e.getMonth()],
    s.getFullYear(),
    e.getFullYear(),
    index === 0
      ? "actual"
      : `hace ${index}`,
  ]
    .join(" ")
    .toLowerCase();
}

export function getBadge(index: number) {
  if (index === 0) {
    return {
      label: "Actual",
      className:
        "bg-emerald-50 text-emerald-700",
    };
  }

  if (index === 1) {
    return {
      label: "Hace 1 sem.",
      className:
        "bg-slate-100 text-slate-500",
    };
  }

  return {
    label: `Hace ${index} sem.`,
    className:
      "bg-slate-100 text-slate-500",
  };
}