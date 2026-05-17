export const useCurrentWeekRange = () => {
  const today = new Date()

  const firstDay = new Date(today)
  const lastDay = new Date(today)

  const day = today.getDay()

  // Ajustar para que la semana inicie en lunes
  const diffToMonday = day === 0 ? -6 : 1 - day

  firstDay.setDate(today.getDate() + diffToMonday)
  lastDay.setDate(firstDay.getDate() + 6)

  const startDay = firstDay.getDate()

  const endFormatted = lastDay.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return `Semana del ${startDay} al ${endFormatted}`
}