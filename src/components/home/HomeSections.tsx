import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Factory,
  GraduationCap,
  HeartPulse,
  Hotel,
  Store,
  type LucideIcon,
} from "lucide-react";
import { SECTORS } from "@/data/sectors";
import { categoryName, getBrands } from "@/lib/catalog";
import { CATEGORY_COVERS } from "@/lib/images";
import { BrandLogo } from "@/components/BrandLogo";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// "Pourquoi Districap ?" — red line drawn by scroll progress
// ---------------------------------------------------------------------------

const WHY_POINTS = [
  {
    title: "Distributeur depuis 2009",
    text: "Une présence de longue date sur le marché marocain de la sécurité électronique et de l'audiovisuel.",
  },
  {
    title: "Marques reconnues",
    text: "Un catalogue construit autour de constructeurs internationaux reconnus : HIKVISION, BOSCH, Optoma, SATEL…",
  },
  {
    title: "Accompagnement projet",
    text: "Aide au choix, dimensionnement, fourniture et assistance à la mise en service de vos installations.",
  },
  {
    title: "Livraison partout au Maroc",
    text: "Commande en ligne ou sur devis, avec paiement à la livraison.",
  },
];

function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const anchor = window.innerHeight * 0.65;
      const value = (anchor - rect.top) / rect.height;
      setProgress(Math.min(1, Math.max(0, value)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress };
}

export function WhySection() {
  const { ref, progress } = useScrollProgress<HTMLOListElement>();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal className="lg:sticky lg:top-40 lg:self-start">
          <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            Pourquoi nous choisir
          </p>
          <h2 className="mt-2 text-3xl">Pourquoi Districap ?</h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Depuis 2009, nous accompagnons installateurs, intégrateurs, entreprises et
            administrations dans le choix et la fourniture de leurs équipements.
          </p>
        </Reveal>
        <ol ref={ref} className="relative space-y-10 pl-10">
          <span aria-hidden="true" className="absolute top-1 bottom-1 left-[7px] w-0.5 bg-border" />
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-[7px] w-0.5 origin-top bg-primary"
            style={{ transform: `scaleY(${progress})` }}
          />
          {WHY_POINTS.map((point, i) => {
            const reached = progress >= i / WHY_POINTS.length + 0.02;
            return (
              <li key={point.title} className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1 -left-10 grid size-4 place-items-center rounded-full border-2 bg-background transition-all duration-300",
                    reached ? "scale-110 border-primary" : "border-border",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full bg-primary transition-transform duration-300",
                      reached ? "scale-100" : "scale-0",
                    )}
                  />
                </span>
                <h3
                  className={cn(
                    "text-lg transition-opacity duration-300",
                    reached ? "opacity-100" : "opacity-50",
                  )}
                >
                  {point.title}
                </h3>
                <p className="mt-1 text-muted-foreground">{point.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Solutions par secteur
// ---------------------------------------------------------------------------

const SECTOR_ICONS: Record<string, LucideIcon> = {
  commerces: Store,
  bureaux: Building2,
  industrie: Factory,
  hotellerie: Hotel,
  education: GraduationCap,
  sante: HeartPulse,
};

export function SectorsSection() {
  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <h2 className="text-3xl">Solutions par secteur</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Retrouvez les équipements adaptés à votre activité.
          </p>
        </Reveal>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((sector, i) => {
            const Icon = SECTOR_ICONS[sector.slug] ?? Building2;
            const image = sector.image ?? CATEGORY_COVERS[sector.cover];
            return (
              <Reveal as="li" key={sector.slug} delay={i * 60}>
                <article className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-xl bg-ink p-5 text-ink-foreground">
                  {image && (
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20" />
                  <div className="relative">
                    <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 text-xl text-ink-foreground">{sector.name}</h3>
                    <p className="mt-1 text-sm opacity-80">{sector.text}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {sector.categories.map((slug) => (
                        <li key={slug}>
                          <Link
                            to="/categorie/$slug"
                            params={{ slug }}
                            className="inline-flex rounded-full border border-white/25 px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:bg-primary"
                          >
                            {categoryName(slug)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Brands marquee
// ---------------------------------------------------------------------------

export function BrandsMarquee() {
  const brands = getBrands();
  return (
    <section className="overflow-hidden border-y border-border bg-surface py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Nos marques partenaires
        </h2>
      </div>
      <div className="marquee-mask mt-8">
        <ul className="marquee-track flex w-max items-center gap-14 px-7">
          {[...brands, ...brands].map((brand, i) => (
            <li
              key={`${brand.slug}-${i}`}
              aria-hidden={i >= brands.length}
              className="group relative flex flex-col items-center gap-1.5"
            >
              <BrandLogo brand={brand} interactive />
              {brand.exclusive && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
                  Distributeur exclusif
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CTA banner
// ---------------------------------------------------------------------------

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 md:pt-20">
      <Reveal className="relative isolate overflow-hidden rounded-2xl bg-ink px-6 py-12 text-center text-ink-foreground md:px-16 md:py-16">
        <div
          aria-hidden="true"
          className="cta-gradient absolute inset-y-0 -left-full -z-10 w-[300%]"
        />
        <h2 className="text-3xl text-ink-foreground">Un projet ? Demandez un devis gratuit</h2>
        <p className="mx-auto mt-3 max-w-2xl opacity-85">
          Décrivez votre besoin : notre équipe revient vers vous avec une proposition chiffrée et
          adaptée à votre site.
        </p>
        <Button asChild size="lg" className="press group mt-8">
          <Link to="/devis">
            Demander mon devis
            <ArrowRight className="size-4 group-hover:animate-[arrow-nudge_800ms_ease-in-out_infinite]" />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
