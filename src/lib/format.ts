// Fixed timezone so server-rendered and client-rendered dates always agree.
const TIME_ZONE = "America/Sao_Paulo";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
});

export function formatDateTime(date: Date | string | number) {
  return dateTimeFormatter.format(new Date(date));
}

export function formatShortDate(date: Date | string | number) {
  return shortDateFormatter.format(new Date(date));
}
