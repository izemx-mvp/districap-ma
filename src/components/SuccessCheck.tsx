/** Animated drawn checkmark used by form success states. */
export function SuccessCheck({ className = "mx-auto size-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M18 33l10 10 18-20"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="draw-check"
      />
    </svg>
  );
}
