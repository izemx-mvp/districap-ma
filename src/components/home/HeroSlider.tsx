import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AMBIANCE } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLIDE_DURATION = 6000;

const SLIDES = [
  {
    image: AMBIANCE.videosurveillance,
    eyebrow: "Vidéosurveillance",
    title: "Surveillez vos sites en 4K, où que vous soyez",
    text: "Caméras IP, kits complets et enregistreurs NVR des plus grandes marques, disponibles à Casablanca.",
    slug: "videosurveillance",
  },
  {
    image: AMBIANCE.sonorisation,
    eyebrow: "Sonorisation & Audiovisuel",
    title: "Des salles équipées pour être vues et entendues",
    text: "Haut-parleurs, amplificateurs, vidéoprojecteurs laser et solutions de visioconférence pour vos espaces professionnels.",
    slug: "sonorisation",
  },
  {
    image: AMBIANCE.securite,
    eyebrow: "Incendie & Intrusion",
    title: "La sécurité de vos locaux, sans compromis",
    text: "Centrales de détection, détecteurs, alarmes anti-intrusion et contrôle d'accès pour protéger vos bâtiments.",
    slug: "detection-incendie",
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Faint circuit/grid pattern drifting slowly behind the slides. */
function CircuitBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="circuit-drift absolute -inset-[60px] h-[calc(100%+120px)] w-[calc(100%+120px)] text-white opacity-[0.07]">
        <defs>
          <pattern id="hero-circuit" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 30h18l6-6h12l6 6h18M30 0v18m0 24v18" fill="none" stroke="currentColor" />
            <circle cx="24" cy="24" r="2" fill="currentColor" />
            <circle cx="42" cy="30" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-circuit)" />
      </svg>
    </div>
  );
}

function WordReveal({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <span
            className="word-rise inline-block"
            style={{ animationDelay: `${baseDelay + i * 60}ms` }}
          >
            {word}
            {" "}
          </span>
        </span>
      ))}
    </>
  );
}

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const slide = SLIDES[index] ?? SLIDES[0]!;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length),
    [],
  );

  // With reduced motion the progress animation is disabled, so rotate on a timer
  // only when motion is allowed; otherwise the user navigates manually.
  const autoplay = !reducedMotion;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  return (
    <section
      className="group/hero relative h-[540px] overflow-hidden bg-ink md:h-[600px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) touchStart.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        const t = e.changedTouches[0];
        touchStart.current = null;
        if (!start || !t) return;
        const dx = t.clientX - start.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.clientY - start.y)) go(dx < 0 ? 1 : -1);
      }}
      aria-roledescription="carrousel"
      aria-label="Nos univers à la une"
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.slug}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <img
            src={s.image}
            alt=""
            width={1600}
            height={912}
            fetchPriority={i === 0 ? "high" : "low"}
            className={cn("size-full object-cover opacity-55", i === index && "ken-burns")}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent" />
      <CircuitBackground />

      <div
        key={slide.slug}
        className="absolute inset-0"
        role="group"
        aria-roledescription="diapositive"
        aria-label={`${index + 1} sur ${SLIDES.length}`}
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 pb-10 text-ink-foreground md:px-16 xl:px-4">
          <p className="rise-in text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            {slide.eyebrow}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-tight md:text-5xl">
            <WordReveal text={slide.title} baseDelay={80} />
          </h1>
          <p
            className="rise-in mt-4 max-w-xl text-base opacity-90"
            style={{ animationDelay: "420ms" }}
          >
            {slide.text}
          </p>
          <div className="rise-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "540ms" }}>
            <Button asChild size="lg" className="glow-pulse press group">
              <Link to="/categorie/$slug" params={{ slug: slide.slug }}>
                Découvrir la gamme
                <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="press border-white/40 bg-transparent text-ink-foreground hover:bg-white/10"
            >
              <Link to="/devis">Demander un devis</Link>
            </Button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Visuel précédent"
        className="press absolute top-1/2 left-4 hidden -translate-y-1/2 rounded-full border border-white/25 bg-ink/40 p-3 text-ink-foreground opacity-0 backdrop-blur transition-opacity duration-300 group-hover/hero:opacity-100 focus-visible:opacity-100 md:block"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Visuel suivant"
        className="press absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-full border border-white/25 bg-ink/40 p-3 text-ink-foreground opacity-0 backdrop-blur transition-opacity duration-300 group-hover/hero:opacity-100 focus-visible:opacity-100 md:block"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Aller au visuel ${i + 1} : ${s.eyebrow}`}
            aria-current={i === index}
            className={cn(
              "h-2 overflow-hidden rounded-full bg-white/40 transition-all duration-300",
              i === index ? "w-12" : "w-2 hover:bg-white/70",
            )}
          >
            {i === index && autoplay && (
              <span
                key={index}
                className="progress-fill block h-full w-full bg-primary"
                style={{
                  animationDuration: `${SLIDE_DURATION}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
                onAnimationEnd={() => go(1)}
              />
            )}
            {i === index && !autoplay && <span className="block h-full w-full bg-primary" />}
          </button>
        ))}
      </div>
    </section>
  );
}
