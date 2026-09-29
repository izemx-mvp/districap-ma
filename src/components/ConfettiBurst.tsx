import { useEffect, useRef } from "react";

const COLORS = ["var(--color-primary)", "var(--color-ink)", "#f5b400", "var(--color-success)"];
const PIECES = 36;

/** One subtle confetti burst from the center of its box (transform/opacity only). */
export function ConfettiBurst({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pieces: HTMLSpanElement[] = [];
    for (let i = 0; i < PIECES; i++) {
      const piece = document.createElement("span");
      const w = 5 + Math.random() * 4;
      Object.assign(piece.style, {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: `${w}px`,
        height: `${w * (Math.random() > 0.5 ? 0.45 : 1)}px`,
        borderRadius: Math.random() > 0.6 ? "999px" : "2px",
        background: COLORS[i % COLORS.length],
        willChange: "transform, opacity",
      });
      root.appendChild(piece);
      pieces.push(piece);
      const angle = (Math.PI * 2 * i) / PIECES + Math.random() * 0.4;
      const distance = 70 + Math.random() * 90;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance - 30;
      const rotate = Math.random() * 540 - 270;
      piece
        .animate(
          [
            { transform: "translate(-50%, -50%) scale(0.4)", opacity: 1 },
            {
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotate}deg) scale(1)`,
              opacity: 1,
              offset: 0.6,
            },
            {
              transform: `translate(calc(-50% + ${x * 1.1}px), calc(-50% + ${y + 60}px)) rotate(${rotate * 1.4}deg) scale(0.9)`,
              opacity: 0,
            },
          ],
          {
            duration: 1300 + Math.random() * 400,
            delay: 350,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          },
        )
        .finished.then(() => piece.remove())
        .catch(() => piece.remove());
    }
    return () => pieces.forEach((p) => p.remove());
  }, []);

  return <div ref={ref} aria-hidden="true" className={className} />;
}
