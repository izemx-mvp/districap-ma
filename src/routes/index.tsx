import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Headset,
  Truck,
} from "lucide-react";
import { AMBIANCE } from "@/lib/images";
import { brandsQuery, categoriesQuery, productsQuery } from "@/lib/catalog";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { CountUp, Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DISTRICAP – Vidéosurveillance, sécurité et audiovisuel au Maroc" },
      {
        name: "description",
        content:
          "Achetez en ligne caméras IP, kits de vidéosurveillance, alarmes, détection incendie, sonorisation et vidéoprojection. Livraison partout au Maroc, paiement à la livraison.",
      },
      {
        property: "og:title",
        content: "DISTRICAP – Vidéosurveillance, sécurité et audiovisuel au Maroc",
      },
      {
        property: "og:description",
        content:
          "Distributeur à Casablanca depuis 2009 : vidéosurveillance, alarme, incendie, sonorisation, audiovisuel et réseau.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const SLIDES = [
  {
    image: AMBIANCE.videosurveillance,
    eyebrow: "Vidéosurveillance",
    title: "Surveillez vos sites en 4K, où que vous soyez",
    text: "Caméras IP, kits complets et enregistreurs NVR des plus grandes marques, disponibles en stock à Casablanca.",
    to: "/categorie/$slug",
    slug: "videosurveillance",
  },
  {
    image: AMBIANCE.sonorisation,
    eyebrow: "Sonorisation & Audiovisuel",
    title: "Des salles équipées pour être vues et entendues",
    text: "Haut-parleurs, amplificateurs, vidéoprojecteurs laser et solutions de visioconférence pour vos espaces professionnels.",
    to: "/categorie/$slug",
    slug: "sonorisation",
  },
  {
    image: AMBIANCE.securite,
    eyebrow: "Incendie & Intrusion",
    title: "La sécurité de vos locaux, sans compromis",
    text: "Centrales CMSI, détecteurs, alarmes anti-intrusion et contrôle d'accès conformes aux normes en vigueur.",
    to: "/categorie/$slug",
    slug: "detection-incendie",
  },
];

const REASSURANCE = [
  { icon: Truck, title: "Livraison partout au Maroc", text: "Expédition rapide depuis Casablanca" },
  { icon: Banknote, title: "Paiement à la livraison", text: "Vous réglez à la réception" },
  { icon: BadgeCheck, title: "ans d'expertise", text: "Distributeur actif depuis 2009", count: 16 },
  { icon: Headset, title: "Conseil technique", text: "Une équipe d'ingénieurs à vos côtés" },
];

function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative h-[520px] overflow-hidden bg-ink md:h-[580px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrousel"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.slug}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={i !== index}
        >
          <img
            src={slide.image}
            alt=""
            width={1600}
            height={912}
            className={cn("size-full object-cover opacity-55", i === index && "ken-burns")}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-transparent" />
          {i === index && (
            <div className="absolute inset-0">
              <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-4 text-ink-foreground">
                <p
                  className="rise-in text-sm font-semibold tracking-[0.2em] text-primary uppercase"
                  style={{ animationDelay: "0ms" }}
                >
                  {slide.eyebrow}
                </p>
                <h1
                  className="rise-in mt-3 max-w-2xl text-4xl leading-tight md:text-5xl"
                  style={{ animationDelay: "120ms" }}
                >
                  {slide.title}
                </h1>
                <p
                  className="rise-in mt-4 max-w-xl text-base opacity-90"
                  style={{ animationDelay: "240ms" }}
                >
                  {slide.text}
                </p>
                <div
                  className="rise-in mt-8 flex flex-wrap gap-3"
                  style={{ animationDelay: "360ms" }}
                >
                  <Button asChild size="lg" className="glow-pulse press">
                    <Link to={slide.to} params={{ slug: slide.slug }}>
                      Découvrir la gamme <ArrowRight className="size-4" />
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
          )}
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Aller au visuel ${i + 1}`}
            className={cn(
              "h-2 overflow-hidden rounded-full bg-white/40 transition-all duration-300",
              i === index ? "w-12" : "w-2",
            )}
          >
            {i === index && (
              <span
                key={`${index}-${paused}`}
                className="block h-full bg-primary"
                style={{
                  animation: paused ? "none" : "ken-burns 0s",
                  width: "100%",
                  transformOrigin: "left",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: brands = [] } = useQuery(brandsQuery);

  const parents = categories.filter((c) => !c.parent_slug);
  const promos = products.filter((p) => p.old_price !== null).slice(0, 8);
  const nouveautes = products.filter((p) => p.is_new).slice(0, 4);

  return (
    <>
      <HeroSlider />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {REASSURANCE.map((item, i) => (
            <Reveal key={item.title} delay={i * 70} className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">
                  {item.count ? (
                    <>
                      <CountUp to={item.count} suffix="+" /> {item.title}
                    </>
                  ) : (
                    item.title
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="text-3xl">Nos univers produits</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Huit familles de produits pour équiper vos bâtiments, de la caméra IP à la
            salle de conférence.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {parents.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 70}>
              <Link
                to="/categorie/$slug"
                params={{ slug: cat.slug }}
                className="group relative block h-44 overflow-hidden rounded-xl"
              >
                <img
                  src={
                    cat.image_key === "sono" || cat.image_key === "av"
                      ? AMBIANCE.sonorisation
                      : cat.image_key === "incendie" || cat.image_key === "alarme"
                        ? AMBIANCE.securite
                        : AMBIANCE.videosurveillance
                  }
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-250 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent transition-opacity duration-250 group-hover:from-ink" />
                <span className="absolute inset-x-4 bottom-4 flex items-center gap-2 text-ink-foreground transition-transform duration-250 group-hover:-translate-y-1.5">
                  <ArrowRight className="size-4 -translate-x-3 text-primary opacity-0 transition-all duration-250 group-hover:translate-x-0 group-hover:opacity-100" />
                  <span className="font-semibold">{cat.name}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl">Produits en promotion</h2>
              <p className="mt-2 text-muted-foreground">
                Des références sélectionnées à prix réduit, dans la limite des stocks
                disponibles.
              </p>
            </div>
          </Reveal>
          <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-64 shrink-0 snap-start">
                    <ProductCardSkeleton />
                  </div>
                ))
              : promos.map((p, i) => (
                  <Reveal key={p.id} delay={i * 70} className="w-64 shrink-0 snap-start">
                    <ProductCard product={p} />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="text-3xl">Nouveautés</h2>
          <p className="mt-2 text-muted-foreground">
            Les dernières références entrées à notre catalogue.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : nouveautes.map((p, i) => (
                <Reveal key={p.id} delay={i * 70}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
        </div>
      </section>

      <section className="overflow-hidden border-y border-border bg-surface py-10">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Nos marques partenaires
          </p>
        </div>
        <div className="mt-8 flex w-max marquee-track gap-14 px-6">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={`${brand.id}-${i}`}
              className="text-xl font-bold tracking-wide text-muted-foreground/60 transition-colors duration-250 hover:text-primary"
            >
              {brand.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl">Pourquoi Districap ?</h2>
            <p className="mt-3 text-muted-foreground">
              Depuis 2009, nous accompagnons installateurs, intégrateurs, entreprises et
              administrations dans le choix et la fourniture de leurs équipements.
            </p>
          </Reveal>
          <ul className="relative space-y-6 border-l-2 border-primary/30 pl-6">
            {[
              {
                title: "Distributeur depuis 2009",
                text: "Plus de seize ans d'expérience sur le marché marocain de la sécurité électronique et de l'audiovisuel.",
              },
              {
                title: "Exclusivités de marques",
                text: "Représentation exclusive de plusieurs constructeurs internationaux, avec garantie et support officiels.",
              },
              {
                title: "Accompagnement projet",
                text: "Étude technique, dimensionnement, fourniture et assistance à la mise en service de vos installations.",
              },
            ].map((point, i) => (
              <Reveal as="li" key={point.title} delay={i * 120}>
                <span className="absolute -left-[7px] mt-1.5 block size-3 rounded-full bg-primary" />
                <h3 className="text-lg">{point.title}</h3>
                <p className="mt-1 text-muted-foreground">{point.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <Reveal className="ink-panel overflow-hidden rounded-2xl px-6 py-12 text-center md:px-16">
          <h2 className="text-3xl text-ink-foreground">
            Un projet ? Demandez un devis gratuit
          </h2>
          <p className="mx-auto mt-3 max-w-2xl opacity-85">
            Décrivez votre besoin : nos ingénieurs vous répondent sous 24 heures ouvrées
            avec une proposition chiffrée et adaptée à votre site.
          </p>
          <Button asChild size="lg" className="press group mt-8">
            <Link to="/devis">
              Demander mon devis
              <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
