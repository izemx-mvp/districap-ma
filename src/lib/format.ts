export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "Sur devis";
  return `${new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace(/\u202f|\u00a0/g, " ")} MAD`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function isValidMoroccanPhone(value: string) {
  const digits = value.replace(/[^0-9+]/g, "");
  return /^(?:\+212|00212|0)(5|6|7)\d{8}$/.test(digits);
}
