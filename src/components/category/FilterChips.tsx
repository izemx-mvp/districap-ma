import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterChip = { key: string; label: string; onRemove: () => void };

const EXIT_MS = 160;

/** Removable filter chips that scale in on mount and scale out before removal. */
export function FilterChips({
  chips,
  onClearAll,
}: {
  chips: FilterChip[];
  onClearAll: () => void;
}) {
  const [leaving, setLeaving] = useState<string[]>([]);

  if (chips.length === 0) return null;

  const remove = (chip: FilterChip) => {
    setLeaving((l) => [...l, chip.key]);
    window.setTimeout(() => {
      chip.onRemove();
      setLeaving((l) => l.filter((k) => k !== chip.key));
    }, EXIT_MS);
  };

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Filtres actifs">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => remove(chip)}
          aria-label={`Retirer le filtre ${chip.label}`}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-primary py-1 pr-2 pl-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            leaving.includes(chip.key) ? "chip-out" : "chip-in",
          )}
        >
          {chip.label}
          <X className="size-3.5" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="px-2 text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
      >
        Tout effacer
      </button>
    </div>
  );
}
