export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Only allow redirects to internal paths. */
export function safeRedirect(value: unknown) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/";
}

/** Password rules shown under the sign-up password field. */
export const PASSWORD_RULES = [
  { label: "8 caractères minimum", test: (v: string) => v.length >= 8 },
  { label: "Une majuscule", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Un chiffre", test: (v: string) => /\d/.test(v) },
  { label: "Un caractère spécial", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function passwordScore(value: string) {
  return PASSWORD_RULES.filter((rule) => rule.test(value)).length;
}
