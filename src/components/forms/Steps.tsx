import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Horizontal step indicator with a filling connector line. */
export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center" aria-label="Étapes">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            className={cn("flex items-center", i < steps.length - 1 && "flex-1")}
            aria-current={active ? "step" : undefined}
          >
            <span className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition-colors duration-300",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold whitespace-nowrap",
                  active || done ? "text-foreground" : "text-muted-foreground",
                  !active && "hidden sm:inline",
                )}
              >
                {label}
              </span>
            </span>
            {i < steps.length - 1 && (
              <span className="relative mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className="absolute inset-0 origin-left bg-primary transition-transform duration-500 ease-entrance"
                  style={{ transform: `scaleX(${done ? 1 : 0})` }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Thin progress bar for multi-step forms. */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-border"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
    >
      <div
        className="h-full origin-left bg-primary transition-transform duration-500 ease-entrance"
        style={{ transform: `scaleX(${value / 100})` }}
      />
    </div>
  );
}
