import { useCallback, useMemo, useState } from "react";

type Errors<T> = Partial<Record<keyof T, string>>;

/**
 * Minimal client-side form state: values, touched fields, live validation and a
 * submit attempt counter (used to replay the shake animation on invalid fields).
 */
export function useFormState<T extends Record<string, string>>(
  initial: T,
  validate: (values: T) => Errors<T>,
) {
  const [values, setValues] = useState<T>(initial);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [attempt, setAttempt] = useState(0);
  const errors = useMemo(() => validate(values), [validate, values]);

  const set = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => setValues((v) => ({ ...v, [key]: value })),
    [],
  );

  const blur = useCallback((key: keyof T) => setTouched((t) => ({ ...t, [key]: true })), []);

  /** Marks `keys` as touched and returns true when none of them has an error. */
  const check = useCallback(
    (keys: (keyof T)[]) => {
      setTouched((t) => ({ ...t, ...Object.fromEntries(keys.map((k) => [k, true])) }));
      const ok = keys.every((k) => !errors[k]);
      if (!ok) setAttempt((a) => a + 1);
      return ok;
    },
    [errors],
  );

  const field = (key: keyof T & string) => {
    const value = values[key] ?? "";
    const shown = touched[key] ? errors[key] : undefined;
    return {
      id: key,
      value,
      onChange: (next: string) => set(key, next as T[typeof key]),
      onBlur: () => blur(key),
      error: shown,
      valid: Boolean(touched[key] && !errors[key] && value.trim()),
      attempt,
    };
  };

  return { values, set, errors, touched, check, field, attempt, setValues };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
