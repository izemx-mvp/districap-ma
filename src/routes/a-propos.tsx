import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Check,
  Clock,
  Compass,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Radar,
  Sparkles,
  Target,
} from "lucide-react";
import { AMBIANCE } from "@/lib/images";
import { SITE } from "@/lib/site";
import { CountUp, Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos – DISTRICAP, distributeur de référence depuis 2009" },
      {
        name: "description",
        content:
          "Créée en 2009 à Casablanca, DISTRICAP est importateur et distributeur de référence de la sécurité électronique au Maroc, distributeur exclusif de LUMENS, ATEN, SATEL, FINSECUR et PREMIUM LINE.",
      },
      { property: "og:title", content: "À propos – DISTRICAP" },
      {
        property: "og:description",
        content: "Notre histoire depuis 2009, nos exclusivités de marques, nos valeurs et nos références.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: 16, suffix: "+", label: "Années d'expérience" },
  { value: 10, suffix: "+", label: "Marques partenaires" },
  { value: 5, suffix: "", label: "Exclusivités au Maroc" },
  { value: 8, suffix: "", label: "Univers de solutions" },
];

// TODO: confirm the intermediate milestones and add years with the client.
const TIMELINE = [
  {
    label: "2009",
    title: "Création à Casablanca",
    text: "DISTRICAP naît avec une ambition claire : distribuer au Maroc du matériel de courant faible fiable, accompagné d'un vrai conseil.",
  },
  {
    label: "Développement",
    title: "Élargissement de l'offre",
    text: "L'offre s'étend de la sécurité électronique à la sonorisation, à l'audiovisuel professionnel et au précâblage informatique.",
  },
  {
    label: "Exclusivités",
    title: "Distributeur exclusif de grandes marques",
    text: "DISTRICAP devient distributeur exclusif au Maroc de LUMENS, ATEN, SATEL, FINSECUR et PREMIUM LINE.",
  },
  {
    label: "Grands projets",
    title: "Des références d'envergure",
    text: "Détection incendie, sonorisation de sécurité, intrusion et vidéosurveillance pour de grands centres commerciaux marocains.",
  },
  {
    label: "Aujourd'hui",
    title: "Un acteur de référence",
    text: "Un large portefeuille clients, plus de dix partenariats avec des marques internationales et une boutique en ligne livrant tout le Maroc.",
  },
];

const EXCLUSIVE_BRANDS = [
  { name: "FINSECUR", domain: "Détection incendie", note: "Certifiée NF et NE" },
  { name: "SATEL", domain: "Intrusion & alarmes", note: "Centrales INTEGRA, Perfecta, MICRA" },
  { name: "LUMENS", domain: "Visioconférence", note: "Caméras et visualiseurs" },
  { name: "ATEN", domain: "Pro AV & KVM", note: "Distribution A/V et contrôle" },
  { name: "PREMIUM LINE", domain: "Solutions professionnelles", note: "Distribution exclusive" },
];

const PARTNERS = ["BOSCH", "UNIVIEW", "HIKVISION", "ABSEN", "Optoma"];

const VALUES = [
  {
    icon: Award,
    title: "Qualité",
    text: "Des produits d'origine, sélectionnés auprès de constructeurs reconnus pour leur fiabilité.",
  },
  {
    icon: Clock,
    title: "Maîtrise des délais",
    text: "Une préparation en amont et un suivi rigoureux de chaque phase de déploiement.",
  },
  {
    icon: Handshake,
    title: "Proximité",
    text: "Un interlocuteur unique, du premier conseil jusqu'au suivi après installation.",
  },
  {
    icon: Radar,
    title: "Veille technologique",
    text: "Une offre constamment mise à jour face aux évolutions de la sécurité électronique.",
  },
];

const REFERENCES = [
  {
    name: "Almazar",
    city: "Marrakech",
    solutions: ["Détection incendie FINSECUR"],
    image: AMBIANCE.securite,
  },
  {
    name: "Marina Mall",
    city: "Casablanca",
    solutions: ["Sonorisation de sécurité BOSCH", "Alarme intrusion SATEL", "Détection incendie FINSECUR"],
    image: AMBIANCE.sonorisation,
  },
  {
    name: "Aeria Mall",
    city: "Casablanca",
    solutions: [
      "Sonorisation de sécurité BOSCH",
      "Détection incendie FINSECUR",
      "Vidéosurveillance UNIVIEW",
      "Alarme intrusion SATEL",
    ],
    image: AMBIANCE.videosurveillance,
  },
];

const GRID_BG = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
      <span className="h-px w-8 bg-primary" />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-12 pb-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-20 lg:pb-24">
        <div>
          <nav className="rise-in text-sm text-muted-foreground" aria-label="Fil d'ariane">
            <Link to="/" className="hover:text-primary">
              Accueil
            </Link>{" "}
            / <span className="text-foreground">À propos</span>
          </nav>
          <div className="rise-in mt-8" style={{ animationDelay: "80ms" }}>
            <Eyebrow>Qui sommes-nous</Eyebrow>
          </div>
          <h1
            className="rise-in mt-4 text-4xl leading-[1.1] md:text-6xl"
            style={{ animationDelay: "160ms" }}
          >
            La sécurité électronique au Maroc,{" "}
            <span className="relative whitespace-nowrap text-primary">
              depuis 2009
              <svg
                viewBox="0 0 200 12"
                className="draw-check absolute -bottom-2 left-0 w-full"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path d="M2 9 Q 100 1 198 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p
            className="rise-in mt-6 max-w-xl text-base text-muted-foreground md:text-lg"
            style={{ animationDelay: "240ms" }}
          >
            DISTRICAP est une entreprise marocaine spécialisée dans la distribution de matériel de
            courant faible. Importateur et distributeur de référence pour les professionnels, les
            entreprises et les grands comptes.
          </p>
          <div className="rise-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "320ms" }}>
            <Button asChild size="lg" className="press group">
              <Link to="/devis">
                Parler de votre projet
                <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="press">
              <Link to="/services">Nos services</Link>
            </Button>
          </div>
        </div>

        <div className="rise-in relative" style={{ animationDelay: "200ms" }}>
          <div className="grid grid-cols-5 grid-rows-6 gap-4" style={{ height: 460 }}>
            <div className="col-span-3 row-span-6 overflow-hidden rounded-3xl">
              <img
                src={AMBIANCE.videosurveillance}
                alt="Équipements de vidéosurveillance"
                width={800}
                height={1000}
                className="ken-burns size-full object-cover"
              />
            </div>
            <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl">
              <img
                src={AMBIANCE.sonorisation}
                alt="Solutions de sonorisation"
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            <div className="col-span-2 row-span-3 overflow-hidden rounded-3xl">
              <img
                src={AMBIANCE.securite}
                alt="Systèmes de sécurité incendie"
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>

          <div className="float-soft absolute -bottom-6 -left-4 flex items-center gap-4 rounded-2xl bg-ink p-5 text-ink-foreground shadow-[var(--shadow-lift)] md:-left-8">
            <span className="text-4xl font-bold text-primary">
              <CountUp to={16} suffix="+" />
            </span>
            <span className="text-sm leading-tight opacity-85">
              années
              <br />
              d'expertise
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="ink-panel relative overflow-hidden">
      <div className="absolute inset-0 opacity-50" style={GRID_BG} aria-hidden />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-12 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 80}
            className={cn("px-4 text-center", i > 0 && "md:border-l md:border-white/10")}
          >
            <p className="text-4xl font-bold text-primary md:text-5xl">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm opacity-75">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function MissionVision() {
  const cards = [
    {
      icon: Target,
      title: "Notre mission",
      text: "Rendre accessibles aux professionnels marocains des solutions de sécurité électronique et d'audiovisuel fiables, accompagnées d'un conseil technique de qualité.",
    },
    {
      icon: Compass,
      title: "Notre ambition",
      text: "Nous imposer comme la référence nationale en termes de qualité, d'offre et de service, en restant continuellement à jour des mutations technologiques.",
    },
    {
      icon: Sparkles,
      title: "Notre approche",
      text: "Une préparation très en amont, des choix techniques pertinents et une gestion optimale des différentes phases de déploiement.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal className="lg:sticky lg:top-40 lg:self-start">
          <Eyebrow>Notre histoire</Eyebrow>
          <h2 className="mt-3 text-3xl md:text-4xl">Une expertise construite projet après projet</h2>
          <p className="mt-5 text-muted-foreground">
            Créée en 2009 à Casablanca, DISTRICAP s'est construite autour d'une idée simple :
            proposer aux professionnels un matériel fiable et un accompagnement sérieux.
          </p>
          <p className="mt-3 text-muted-foreground">
            Aujourd'hui, nous comptons plus de dix collaborations avec de grandes marques
            internationales, un important portefeuille clients et de nombreux projets menés à bien
            à travers le Maroc.
          </p>
        </Reveal>

        <div className="space-y-5">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <article className="group relative flex gap-5 overflow-hidden rounded-2xl border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100" />
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <card.icon className="size-6" />
                </span>
                <div>
                  <h3 className="text-xl">{card.title}</h3>
                  <p className="mt-2 text-muted-foreground">{card.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="text-center">
          <Eyebrow>Notre parcours</Eyebrow>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl md:text-4xl">Les grandes étapes de DISTRICAP</h2>
        </Reveal>

        <ol className="relative mx-auto mt-14 max-w-4xl">
          <span className="absolute top-0 bottom-0 left-5 w-px bg-border md:left-1/2 md:-translate-x-1/2" aria-hidden />
          {TIMELINE.map((item, i) => {
            const right = i % 2 === 1;
            return (
              <Reveal as="li" key={item.title} delay={80} className="relative pb-12 last:pb-0">
                <span className="absolute top-1 left-5 z-10 grid size-4 -translate-x-1/2 place-items-center rounded-full bg-primary ring-4 ring-surface md:left-1/2" />
                <div
                  className={cn(
                    "ml-12 md:ml-0 md:w-1/2",
                    right ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right",
                  )}
                >
                  <span className="inline-block rounded-full bg-ink px-3 py-1 text-xs font-bold tracking-wide text-ink-foreground">
                    {item.label}
                  </span>
                  <div className="mt-3 rounded-2xl border border-border bg-background p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
                    <h3 className="text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow>Nos exclusivités</Eyebrow>
          <h2 className="mt-3 text-3xl md:text-4xl">Distributeur exclusif au Maroc</h2>
        </div>
        <p className="max-w-md text-muted-foreground">
          La confiance de grandes marques internationales, qui nous ont confié la distribution
          exclusive de leurs gammes sur le territoire marocain.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {EXCLUSIVE_BRANDS.map((brand, i) => (
          <Reveal key={brand.name} delay={i * 70}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-ink hover:text-ink-foreground">
              <span className="self-start rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-primary uppercase">
                Exclusif
              </span>
              <p className="mt-8 text-2xl font-bold tracking-tight">{brand.name}</p>
              <p className="mt-1 text-sm font-medium text-primary">{brand.domain}</p>
              <p className="mt-auto pt-6 text-xs text-muted-foreground transition-colors group-hover:text-ink-foreground/70">
                {brand.note}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface py-6">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Ainsi que
        </p>
        <div className="mt-4 flex w-max marquee-track gap-16 px-8">
          {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-xl font-bold tracking-wide text-muted-foreground/50 transition-colors duration-250 hover:text-primary"
            >
              {name}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Values() {
  return (
    <section className="ink-panel relative overflow-hidden py-20">
      <div className="absolute inset-0 opacity-50" style={GRID_BG} aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4">
        <Reveal className="max-w-2xl">
          <Eyebrow>Nos valeurs</Eyebrow>
          <h2 className="mt-3 text-3xl text-ink-foreground md:text-4xl">Ce qui guide notre travail au quotidien</h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-white/10">
                <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <value.icon className="size-6" />
                </span>
                <h3 className="mt-6 text-lg text-ink-foreground">{value.title}</h3>
                <p className="mt-2 text-sm opacity-75">{value.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function References() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <Reveal className="max-w-2xl">
        <Eyebrow>Références</Eyebrow>
        <h2 className="mt-3 text-3xl md:text-4xl">Quelques projets marquants</h2>
        <p className="mt-3 text-muted-foreground">
          Des sites recevant du public, où la sécurité des personnes ne laisse aucune place à
          l'approximation.
        </p>
      </Reveal>

      <ul className="mt-12 border-t border-border">
        {REFERENCES.map((ref, i) => (
          <Reveal as="li" key={ref.name} delay={i * 90}>
            <div className="group relative grid gap-4 border-b border-border py-8 transition-colors duration-300 md:grid-cols-[80px_1fr_1.4fr_140px] md:items-center">
              <span className="text-sm font-bold text-muted-foreground transition-colors group-hover:text-primary">
                0{i + 1}
              </span>
              <div>
                <h3 className="text-2xl transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
                  {ref.name}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {ref.city} · Centre commercial
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ref.solutions.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs transition-colors group-hover:border-primary/40"
                  >
                    <Check className="size-3 text-primary" /> {s}
                  </span>
                ))}
              </div>
              <div className="hidden h-20 overflow-hidden rounded-xl md:block">
                <img
                  src={ref.image}
                  alt=""
                  loading="lazy"
                  className="size-full scale-110 object-cover opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

function ContactCta() {
  const phone = SITE.phones[0];
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20">
      <Reveal className="grid overflow-hidden rounded-3xl border border-border lg:grid-cols-[1.3fr_1fr]">
        <div className="relative bg-primary p-8 text-primary-foreground md:p-14">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <h2 className="relative text-3xl md:text-4xl">Construisons votre prochain projet ensemble</h2>
          <p className="relative mt-4 max-w-lg opacity-90">
            Vidéosurveillance, détection incendie, sonorisation, audiovisuel : parlez-nous de votre
            besoin, nous vous orientons vers la solution adaptée.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="secondary" className="press group">
              <Link to="/devis">
                Demander un devis
                <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="press border-white/40 bg-transparent text-primary-foreground hover:bg-white/10"
            >
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6 bg-background p-8 md:p-14">
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Adresse</p>
              <p className="mt-1 text-sm text-muted-foreground">{SITE.address}</p>
            </div>
          </div>
          {phone && (
            <div className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Téléphone</p>
                {SITE.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                  >
                    {p}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Mail className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">E-mail</p>
              <a href={`mailto:${SITE.email}`} className="mt-1 block text-sm text-muted-foreground hover:text-primary">
                {SITE.email}
              </a>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Clock className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Horaires</p>
              {SITE.hours.map((h) => (
                <p key={h} className="mt-1 text-sm text-muted-foreground">
                  {h}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <MissionVision />
      <Timeline />
      <Brands />
      <Values />
      <References />
      <ContactCta />
    </>
  );
}