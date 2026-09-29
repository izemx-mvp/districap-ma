import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

/** Dual-thumb range slider built on the Radix primitive. */
export function RangeSlider({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  onValueCommit,
  labels,
  className,
}: {
  value: [number, number];
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: [number, number]) => void;
  onValueCommit?: (value: [number, number]) => void;
  labels: [string, string];
  className?: string;
}) {
  return (
    <SliderPrimitive.Root
      value={value}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={1}
      onValueChange={(v) => onValueChange([v[0] ?? min, v[1] ?? max])}
      onValueCommit={(v) => onValueCommit?.([v[0] ?? min, v[1] ?? max])}
      className={cn("relative flex h-5 w-full touch-none items-center select-none", className)}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {labels.map((label) => (
        <SliderPrimitive.Thumb
          key={label}
          aria-label={label}
          className="block size-5 rounded-full border-2 border-primary bg-background shadow transition-transform duration-150 hover:scale-110 focus-visible:scale-110 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none active:scale-110"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
