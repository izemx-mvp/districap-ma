import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | undefined;
  valid?: boolean;
  /** Submit attempt counter: an error shakes again on every failed attempt. */
  attempt?: number;
  optional?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  hint?: string;
  className?: string;
};

/** Drawn checkmark shown when a field is valid. */
export function ValidMark({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-success"
      aria-hidden="true"
    >
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-check"
        style={{ strokeDasharray: 24, strokeDashoffset: 24 }}
      />
    </svg>
  );
}

/** Error message that expands open under the field. */
export function FieldError({ id, error }: { id: string; error?: string | undefined }) {
  const [last, setLast] = useState(error);
  useEffect(() => {
    if (error) setLast(error);
  }, [error]);
  return (
    <div className="collapse-rows" data-open={Boolean(error)}>
      <div className="overflow-hidden">
        <p
          id={`${id}-error`}
          role={error ? "alert" : undefined}
          className="pt-1.5 text-xs text-primary"
        >
          {last}
        </p>
      </div>
    </div>
  );
}

/** Shakes its children whenever `trigger` changes while `active`. */
export function Shake({
  active,
  trigger,
  children,
  className,
}: {
  active: boolean;
  trigger: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      key={active ? trigger : "idle"}
      className={cn(active && trigger > 0 && "shake", className)}
    >
      {children}
    </div>
  );
}

/** Text input / textarea with a floating label, valid checkmark and animated error. */
export function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  valid = false,
  attempt = 0,
  optional = false,
  multiline = false,
  rows = 4,
  type = "text",
  inputMode,
  autoComplete,
  hint,
  className,
}: FieldProps) {
  const control = cn(
    "peer block w-full rounded-md border bg-background px-3 pt-5 pb-2 pr-10 text-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-transparent focus:border-primary focus:ring-3 focus:ring-primary/15",
    error ? "border-primary" : valid ? "border-success/60" : "border-input",
  );
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");
  const shared = {
    id,
    name: id,
    value,
    placeholder: " ",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    onBlur,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy || undefined,
    "aria-required": !optional,
    className: control,
  };

  return (
    <div className={className}>
      <Shake active={Boolean(error)} trigger={attempt}>
        <div className="relative">
          {multiline ? (
            <textarea rows={rows} {...shared} className={cn(control, "resize-y")} />
          ) : (
            <input type={type} inputMode={inputMode} autoComplete={autoComplete} {...shared} />
          )}
          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute top-1.5 left-3 origin-left text-xs text-muted-foreground transition-all duration-200",
              "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm",
              "peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary",
            )}
          >
            {label}
            {optional && <span className="ml-1 opacity-70">(facultatif)</span>}
          </label>
          {!multiline && <ValidMark show={valid && !error} />}
        </div>
      </Shake>
      <FieldError id={id} error={error} />
      {hint && !error && (
        <p id={`${id}-hint`} className="pt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}
