import { useEffect, useState } from "react";
import { ArrowUp, X } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cookies, setCookies] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setMounted(true), 2000);
    const b = setTimeout(() => setTooltip(true), 8000);
    const c = setTimeout(() => setTooltip(false), 14000);
    if (!window.localStorage.getItem("districap.cookies")) {
      const d = setTimeout(() => setCookies(true), 1200);
      return () => {
        clearTimeout(a);
        clearTimeout(b);
        clearTimeout(c);
        clearTimeout(d);
      };
    }
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setShowTop(window.scrollY > 600);
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const acceptCookies = () => {
    window.localStorage.setItem("districap.cookies", "ok");
    setCookies(false);
  };

  return (
    <>
      <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3">
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Revenir en haut"
            className="press grid size-11 place-items-center rounded-full border border-border bg-background shadow-[var(--shadow-card)]"
            style={{
              backgroundImage: `conic-gradient(var(--color-primary) ${progress}%, transparent 0)`,
            }}
          >
            <span className="grid size-9 place-items-center rounded-full bg-background">
              <ArrowUp className="size-4" />
            </span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {tooltip && (
            <span className="rise-in card-surface px-3 py-2 text-xs font-medium">
              Une question ? Écrivez-nous
            </span>
          )}
          <a
            href={whatsappLink("Bonjour DISTRICAP, j'ai une question.")}
            target="_blank"
            rel="noreferrer"
            aria-label="Discuter sur WhatsApp"
            className={cn(
              "press glow-pulse grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-transform duration-300",
              mounted ? "scale-100" : "scale-0",
            )}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-7" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.87 9.87 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm4.52 11.86c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.59.26 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
            </svg>
          </a>
        </div>
      </div>

      {cookies && (
        <div className="rise-in fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/98 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Nous utilisons des cookies pour améliorer votre navigation et mesurer
              l'audience du site.{" "}
              <a href="/confidentialite" className="text-primary underline">
                En savoir plus
              </a>
            </p>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={acceptCookies}>
                <X className="size-4" /> Refuser
              </Button>
              <Button size="sm" onClick={acceptCookies}>
                Accepter
              </Button>
            </div>
          </div>
        </div>
      )}

      <p className="sr-only">{SITE.tagline}</p>
    </>
  );
}
