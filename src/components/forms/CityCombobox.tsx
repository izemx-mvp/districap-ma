import { useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { normalize } from "@/lib/catalog";
import { MOROCCAN_CITIES } from "@/lib/site";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FieldError, Shake } from "@/components/forms/Field";
import { cn } from "@/lib/utils";

/** Searchable city picker (accent-insensitive), also accepts a city not in the list. */
export function CityCombobox({
  id,
  value,
  onChange,
  onBlur,
  error,
  valid = false,
  attempt = 0,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string | undefined;
  valid?: boolean;
  attempt?: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const typed = query.trim();
  const known = MOROCCAN_CITIES.some((c) => normalize(c) === normalize(typed));

  const select = (city: string) => {
    onChange(city);
    setQuery("");
    setOpen(false);
    onBlur?.();
  };

  return (
    <div>
      <Shake active={Boolean(error)} trigger={attempt}>
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) onBlur?.();
          }}
        >
          <PopoverTrigger asChild>
            <button
              id={id}
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              className={cn(
                "relative flex h-[54px] w-full items-end rounded-md border bg-background px-3 pb-2 text-left text-sm transition-[border-color,box-shadow] duration-200 outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15",
                error ? "border-primary" : valid ? "border-success/60" : "border-input",
                open && "border-primary ring-3 ring-primary/15",
              )}
            >
              <span
                className={cn(
                  "absolute left-3 transition-all duration-200",
                  value || open
                    ? "top-1.5 text-xs text-muted-foreground"
                    : "top-3.5 text-sm text-muted-foreground",
                  open && "text-primary",
                )}
              >
                Ville
              </span>
              <span className="flex items-center gap-1.5">
                {value && <MapPin className="size-3.5 text-primary" />}
                {value}
              </span>
              <ChevronsUpDown className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command
              filter={(itemValue, search) =>
                normalize(itemValue).includes(normalize(search)) ? 1 : 0
              }
            >
              <CommandInput
                placeholder="Rechercher une ville…"
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                <CommandGroup>
                  {MOROCCAN_CITIES.map((city) => (
                    <CommandItem key={city} value={city} onSelect={() => select(city)}>
                      <Check
                        className={cn("size-4", value === city ? "opacity-100" : "opacity-0")}
                      />
                      {city}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {typed && !known && (
                  <CommandGroup heading="Autre ville">
                    <CommandItem
                      value={`__autre__${typed}`}
                      onSelect={() => select(typed)}
                      forceMount
                    >
                      <MapPin className="size-4" />
                      Utiliser « {typed} »
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Shake>
      <FieldError id={id} error={error} />
    </div>
  );
}
