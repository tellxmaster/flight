export function formatDate(fechaISO: string): string {
  const date = new Date(fechaISO);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const dateFormated = new Intl.DateTimeFormat("es-ES", options).format(date);

  return dateFormated;
}
