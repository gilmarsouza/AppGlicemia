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

const inputPartsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// "YYYY-MM-DDTHH:mm", the value format of <input type="datetime-local">.
export function toDateTimeLocalValue(date: Date | string | number) {
  const parts = Object.fromEntries(
    inputPartsFormatter
      .formatToParts(new Date(date))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function formatDateTime(date: Date | string | number) {
  return dateTimeFormatter.format(new Date(date));
}

export function formatShortDate(date: Date | string | number) {
  return shortDateFormatter.format(new Date(date));
}
