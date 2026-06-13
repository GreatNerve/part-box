const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

export function formatDateTime(value: string | Date): string {
  return dateTimeFormatter.format(typeof value === "string" ? new Date(value) : value);
}

export function formatDate(value: string | Date): string {
  return dateFormatter.format(typeof value === "string" ? new Date(value) : value);
}
