import { useEffect, useRef, useState } from "react";

/** Tweens a number towards `value` (easeOutCubic) and renders it with `format`. */
export function AnimatedNumber({
  value,
  format,
  duration = 450,
}: {
  value: number;
  format: (value: number) => string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      setDisplay(value);
      return;
    }
    const t0 = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const current = start + (value - start) * (1 - Math.pow(1 - p, 3));
      from.current = current;
      setDisplay(current);
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className="tabular-nums">{format(display)}</span>;
}
