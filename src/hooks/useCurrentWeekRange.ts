export const useCurrentWeekRange = (weekOffset = 0) => {
  const today = new Date()

  const firstDay = new Date(today)
  const lastDay = new Date(today)

  const day = today.getDay()

  // Ajustar para que la semana inicie en lunes
  const diffToMonday = day === 0 ? -6 : 1 - day
  const offsetDays = weekOffset * 7

  firstDay.setDate(today.getDate() + diffToMonday + offsetDays)
  lastDay.setDate(firstDay.getDate() + 6)

  const startDay = firstDay.getDate()

  const endFormatted = lastDay.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return `Semana del ${startDay} al ${endFormatted}`
}