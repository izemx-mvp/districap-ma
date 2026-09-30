import { useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { PASSWORD_RULES, passwordScore } from "@/lib/account-helpers";
import { FieldError, Shake } from "@/components/forms/Field";
import { cn } from "@/lib/utils";

const STRENGTH = [
  { label: "Trop faible", color: "bg-primary" },
  { label: "Faible", color: "bg-primary" },
  { label: "Moyen", color: "bg-amber-500" },
  { label: "Bon", color: "bg-success" },
  { label: "Excellent", color: "bg-success" },
];

/** Password input with floating label, show/hide toggle, caps-lock hint and optional strength meter. */
export function PasswordField({
  id,
  label = "Mot de passe",
  value,
  onChange,
  onBlur,
  error,
  valid = false,
  attempt = 0,
  autoComplete = "current-password",
  showStrength = false,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | undefined;
  valid?: boolean;
  attempt?: number;
  autoComplete?: string;
  showStrength?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const score = passwordScore(value);
  const strength = STRENGTH[score] ?? STRENGTH[0]!;

  return (
    <div>
      <Shake active={Boolean(error)} trigger={attempt}>
        <div className="relative">
          <input
            id={id}
            name={id}
            type={visible ? "text" : "password"}
            value={value}
            placeholder=" "
            autoComplete={autoComplete}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => {
              setCapsLock(false);
              onBlur?.();
            }}
            onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : showStrength ? `${id}-rules` : undefined}
            aria-required
            className={cn(
              "peer block w-full rounded-md border bg-background px-3 pt-5 pb-2 pr-12 text-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-transparent focus:border-primary focus:ring-3 focus:ring-primary/15",
              error ? "border-primary" : valid ? "border-success/60" : "border-input",
            )}
          />
          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute top-1.5 left-3 origin-left text-xs text-muted-foreground transition-all duration-200",
              "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm",
              "peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary",
            )}
          >
            {label}
          </label>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={visible}
            className="press absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="relative size-4">
              <Eye
                className={cn(
                  "absolute inset-0 size-4 transition-[opacity,transform] duration-200",
                  visible ? "scale-50 opacity-0" : "opacity-100",
                )}
              />
              <EyeOff
                className={cn(
                  "absolute inset-0 size-4 transition-[opacity,transform] duration-200",
                  visible ? "opacity-100" : "scale-50 opacity-0",
                )}
              />
            </span>
          </button>
        </div>
      </Shake>
      <FieldError id={id} error={error} />
      <div className="collapse-rows" data-open={capsLock}>
        <div className="overflow-hidden">
          <p className="pt-1.5 text-xs font-medium text-amber-600">Verr. Maj est activé.</p>
        </div>
      </div>

      {showStrength && (
        <div id={`${id}-rules`} className="pt-3">
          <div className="flex items-center gap-3">
            <div className="grid flex-1 grid-cols-4 gap-1.5" aria-hidden="true">
              {PASSWORD_RULES.map((rule, i) => (
                <span key={rule.label} className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn(
                      "block h-full origin-left rounded-full transition-transform duration-300 ease-entrance",
                      strength.color,
                      i < score ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </span>
              ))}
            </div>
            <span
              className="w-20 text-right text-xs font-medium text-muted-foreground"
              aria-live="polite"
            >
              {value ? strength.label : ""}
            </span>
          </div>
          <ul className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.test(value);
              return (
                <li
                  key={rule.label}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors duration-200",
                    ok ? "text-success" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded-full border transition-colors duration-200",
                      ok ? "border-success bg-success text-white" : "border-border",
                    )}
                  >
                    <Check
                      className={cn(
                        "size-2.5 transition-transform duration-200",
                        ok ? "scale-100" : "scale-0",
                      )}
                      strokeWidth={3}
                    />
                  </span>
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
